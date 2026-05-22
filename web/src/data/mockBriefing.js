// Templated mock for the AI briefing.
// Returns the locked 4-field JSON shape { situation, risk, advice, command }.
// Replace with a real DeepSeek call in a later phase — the contract stays the same.

import { DAILY_ORDERS } from './orders.js'

/**
 * @param {Array<{system: string, title: string, desc: string, action: string}>} cards
 * @returns {{situation: string, risk: string, advice: string, command: string}}
 */
export function mockBriefing (cards) {
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

  const situationCard = pick(['situation', 'contradiction', 'morale'])
  const riskCard      = pick(['contradiction', 'morale', 'strategy', 'organization'])
  const adviceCard    = pick(['action', 'strategy', 'organization', 'situation', 'morale', 'contradiction'])

  return {
    situation: `你当前的局面，是「${situationCard.title}」。${situationCard.desc}`,
    risk:      `主要风险落在「${riskCard.title}」。${riskCard.desc}`,
    advice:    `${adviceCard.desc} 行动方向：${adviceCard.action}。`,
    command:   DAILY_ORDERS[Math.floor(Math.random() * DAILY_ORDERS.length)],
  }
}
