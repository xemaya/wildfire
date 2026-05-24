// 星火 Wildfire — AI briefing proxy.
// Holds the locked system prompt + API key server-side. Never expose the key to the client.
// Node 18+ (built-in fetch). No external deps.
//
//   DEEPSEEK_API_KEY=sk-xxx node server/index.js
//
// POST /api/briefing  { cards: [{card_type,card_title,card_desc,action_hint} x3] }
//   -> 200 { situation, risk, advice, command }
//   -> 503 { error:'no_api_key' }  (client falls back to local mock)

import http from 'node:http'

const PORT = process.env.PORT || 8787
const API_KEY = process.env.DEEPSEEK_API_KEY || ''
const API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions'
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash'

// ---- locked system prompt (PRD §12) ----
const SYSTEM_PROMPT = `你是"星火 Wildfire"的战略参谋系统。

你的职责不是安慰用户，不是心理咨询，不是算命，不是预测未来。
你要像一个冷静、克制、长期主义的战略参谋。

用户会抽到三张战略卡，代表其当前人生中的局势、矛盾、行动方向与心理状态。

你需要做的：
1. 分析三张卡之间的关系
2. 判断当前局势
3. 指出潜在风险
4. 给出一个战略方向
5. 生成一句"今日军令"

若提供了"用户近期抽卡记录"，要结合其最近的处境趋势来判断，让简报有连续性：
例如反复出现防御/相持＝长期被动、该考虑转主动；反复出现冒进＝该收敛节奏。
只在判断里体现这种趋势，不要罗列或复述历史。

语言风格：冷静、克制、有战略感、不鸡汤、不夸张、不安慰、不玄学。
你不是在"治愈用户"，你是在"分析一场人生战局"。

输出必须简洁，不要长篇大论。
禁止使用：命中注定、宇宙、能量、好运、你一定会成功、加油、相信自己。
多使用：战线、节奏、根据地、局势、主动权、组织度、风险、推进、矛盾。

输出必须是合法 JSON，且只输出 JSON，不要任何额外文字：
{ "situation": "一句当前局势", "risk": "一句当前风险", "advice": "一句当前建议", "command": "一句今日军令" }`

function readBody (req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', c => { data += c; if (data.length > 1e6) req.destroy() })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

function validate (b) {
  if (!b || typeof b !== 'object') return false
  return ['situation', 'risk', 'advice', 'command']
    .every(k => typeof b[k] === 'string' && b[k].trim().length > 0)
}

/** Trim redundant labels the model sometimes prepends (UI already labels fields). */
function sanitize (b) {
  const strip = s => s
    .trim()
    .replace(/^(今日军令|军令|当前局势|当前风险|当前建议|局势|风险|建议)\s*[:：]\s*/, '')
    .trim()
  return {
    situation: strip(b.situation),
    risk: strip(b.risk),
    advice: strip(b.advice),
    command: strip(b.command),
  }
}

async function callDeepSeek (cards, recent) {
  let userContent =
    '请分析以下三张战略卡：\n' + JSON.stringify({ cards }, null, 2)
  if (Array.isArray(recent) && recent.length) {
    userContent +=
      '\n\n【用户近期抽卡记录 · 由近及远，供你判断连续性，勿罗列】：\n' +
      JSON.stringify(recent.slice(0, 5), null, 2)
  }

  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
      response_format: { type: 'json_object' },
      temperature: 1.1,
      max_tokens: 500,
    }),
  })
  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    throw new Error(`DeepSeek ${resp.status}: ${text.slice(0, 200)}`)
  }
  const data = await resp.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) throw new Error('empty completion')
  return JSON.parse(content)
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, hasKey: !!API_KEY, model: MODEL }))
    return
  }

  if (req.method === 'POST' && req.url === '/api/briefing') {
    if (!API_KEY) {
      res.writeHead(503, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'no_api_key' }))
      return
    }
    try {
      const { cards, recent } = JSON.parse(await readBody(req) || '{}')
      if (!Array.isArray(cards) || cards.length !== 3) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'bad_cards' }))
        return
      }

      let briefing = null
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          briefing = await callDeepSeek(cards, recent)
          if (validate(briefing)) break
        } catch (e) {
          if (attempt === 1) throw e
        }
      }

      if (!validate(briefing)) {
        res.writeHead(502, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'bad_shape' }))
        return
      }

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(sanitize(briefing)))
    } catch (e) {
      console.error('[WF] briefing error:', e.message)
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'upstream', detail: e.message }))
    }
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'not_found' }))
})

server.listen(PORT, () => {
  console.log(`[WF] briefing proxy on :${PORT}  (key: ${API_KEY ? 'set' : 'MISSING — client will mock'})`)
})
