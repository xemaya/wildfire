// 星火 Wildfire — 语录卡池（115 句 · 三类：形势 / 方针 / 行动）
// 卡的本体是毛选原话（逐字）。抽卡 = 形势/方针/行动 各抽一张。
// 兼容旧视图：每张卡仍提供 title(短标签)/desc(原话)/vol(出处) 字段。
import DECK from './deck.json'

export const SYSTEMS = {
  xingshi:  { cn: '形势', en: 'Situation', sym: '势' },
  fangzhen: { cn: '方针', en: 'Doctrine',  sym: '针' },
  xingdong: { cn: '行动', en: 'Action',    sym: '行' },
}
export const SYSTEM_KEYS = Object.keys(SYSTEMS)
const CAT_TO_KEY = { 形势: 'xingshi', 方针: 'fangzhen', 行动: 'xingdong' }

/** Crash-proof system lookup (handles legacy/unknown keys). */
export const sysOf = (key) => SYSTEMS[key] || { cn: '？', en: '', sym: '？' }

/** Short handle from a quote — for compact contexts (flip strip / timeline / archive). */
function labelOf (quote) {
  const head = quote.split(/[，。！？、；：]/)[0] || quote
  return head.length > 9 ? head.slice(0, 9) + '…' : head
}

/** Flat list of all cards, each tagged with its system (=category) key. */
export const ALL_CARDS = DECK.map(c => ({
  id: c.id,
  system: CAT_TO_KEY[c.cat] || 'xingshi',
  quote: c.quote,
  src: c.src,
  img: c.img,
  // —— backward-compat fields consumed by existing views ——
  title: labelOf(c.quote),
  desc: c.quote,
  action: '',
  vol: c.src,
}))

export const CARDS_BY_SYSTEM = SYSTEM_KEYS.reduce((acc, k) => {
  acc[k] = ALL_CARDS.filter(c => c.system === k)
  return acc
}, {})

function pick (arr) { return arr[Math.floor(Math.random() * arr.length)] }

/**
 * Draw the triad: one 形势, one 方针, one 行动 — the product's core mental model
 * (我在什么形势 → 用什么方针 → 落地什么行动). Returns 3 cards in that order;
 * the flip/reveal order is up to the UI.
 */
export function drawThree () {
  return SYSTEM_KEYS.map(k => ({ ...pick(CARDS_BY_SYSTEM[k]) }))
}
