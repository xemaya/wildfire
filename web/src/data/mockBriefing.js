// Templated mock for the AI briefing.
// Returns the locked 4-field JSON shape { situation, risk, advice, command }.
// Replace with a real DeepSeek call in a later phase — the contract stays the same.

import { DAILY_ORDERS } from './orders.js'

/**
 * @param {Array<{system: string, title: string, desc: string, action: string}>} cards
 * @returns {{situation: string, risk: string, advice: string, command: string}}
 */
export function mockBriefing (cards, recent = []) {
  const bySystem = Object.fromEntries(cards.map(c => [c.system, c]))
  const used = new Set()

  /** Pick the first system in priorities that's both present AND not yet used. */
  function pick (priorities) {
    for (const sys of priorities) {
      const c = bySystem[sys]
      if (c && !used.has(c.id)) {
        used.add(c.id)
        return c
      }
    }
    // fall through: any unused card from the draw
    for (const c of cards) {
      if (!used.has(c.id)) { used.add(c.id); return c }
    }
    return cards[0]
  }

  const xingshi  = pick(['xingshi', 'fangzhen', 'xingdong'])
  const fangzhen = pick(['fangzhen', 'xingshi', 'xingdong'])
  const xingdong = pick(['xingdong', 'fangzhen', 'xingshi'])
  const q = c => c.quote || c.desc

  const cont = recent.length ? `近期第 ${recent.length + 1} 次推演——` : ''
  return {
    situation: `${cont}你眼下的形势——${q(xingshi)}（《${xingshi.src || ''}》）`,
    risk:      `方针上须把握「${q(fangzhen)}」，错了大方向越走越偏。`,
    advice:    `落地行动——${q(xingdong)}`,
    command:   DAILY_ORDERS[Math.floor(Math.random() * DAILY_ORDERS.length)],
  }
}
