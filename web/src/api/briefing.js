import { mockBriefing } from '../data/mockBriefing.js'
import { SYSTEMS } from '../data/cards.js'

const TIMEOUT_MS = 20000

/**
 * Request an AI briefing for the 3 drawn cards.
 * Maps cards to the PRD §10 input shape, posts to the proxy, validates the
 * locked 4-key response. Falls back to the local mock on any failure so the
 * UX never dead-ends.
 *
 * @returns {Promise<{ briefing: {situation,risk,advice,command}, source: 'ai'|'mock' }>}
 */
export async function fetchBriefing (cards, recent = []) {
  const payload = {
    cards: cards.map(c => ({
      card_type: SYSTEMS[c.system]?.cn || c.system, // 形势 / 方针 / 行动
      card_title: c.title,                          // 短标签
      card_desc: c.quote || c.desc,                 // 毛选原话
      action_hint: c.src ? `《${c.src}》` : '',      // 出处
    })),
    recent, // 近期抽卡记录（连续性）
  }

  try {
    const resp = await fetch('/api/briefing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!resp.ok) throw new Error(`api ${resp.status}`)
    const b = await resp.json()
    if (b && b.situation && b.risk && b.advice && b.command) {
      return { briefing: b, source: 'ai' }
    }
    throw new Error('bad shape')
  } catch (e) {
    console.warn('[WF] briefing fell back to mock:', e.message)
    return { briefing: mockBriefing(cards, recent), source: 'mock' }
  }
}
