import { mockBriefing } from '../data/mockBriefing.js'

const TIMEOUT_MS = 20000

/**
 * Request an AI briefing for the 3 drawn cards.
 * Maps cards to the PRD §10 input shape, posts to the proxy, validates the
 * locked 4-key response. Falls back to the local mock on any failure so the
 * UX never dead-ends.
 *
 * @returns {Promise<{ briefing: {situation,risk,advice,command}, source: 'ai'|'mock' }>}
 */
export async function fetchBriefing (cards) {
  const payload = {
    cards: cards.map(c => ({
      card_type: c.system,
      card_title: c.title,
      card_desc: c.desc,
      action_hint: c.action,
    })),
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
    return { briefing: mockBriefing(cards), source: 'mock' }
  }
}
