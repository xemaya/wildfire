import { defineStore } from 'pinia'
import { drawThree } from '../data/cards.js'

const STORAGE_KEY = 'wf-history-v1'
const HISTORY_CAP = 100

/** Generates a UUIDv4-ish id. Crypto.randomUUID is sufficient on modern browsers. */
function newId () {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `wf-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function loadHistory () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveHistory (history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, HISTORY_CAP)))
  } catch (e) {
    console.warn('[WF] failed to persist history', e)
  }
}

export const useDrawStore = defineStore('draw', {
  state: () => ({
    /** the current in-progress draw, or null. */
    current: null,
    /** all completed draws, newest first. Persisted to localStorage. */
    history: loadHistory(),
  }),

  getters: {
    /** Set of card ids the user has drawn at least once (for archive unlock). */
    unlockedIds (state) {
      const ids = new Set()
      for (const entry of state.history) {
        for (const card of entry.cards) ids.add(card.id)
      }
      return ids
    },
    /** Count of distinct unlocked cards. */
    unlockedCount () {
      return this.unlockedIds.size
    },
  },

  actions: {
    /** Start a new 3-card draw. Replaces any in-progress one. */
    begin () {
      this.current = {
        id: newId(),
        drawnAt: new Date().toISOString(),
        cards: drawThree(),
        revealed: [false, false, false],
        briefing: null,
      }
      return this.current
    },

    /** Mark one card as revealed (0–2 in original draw order). */
    reveal (index) {
      if (!this.current) return
      this.current.revealed[index] = true
    },

    /** True iff all three cards have been flipped face-up. */
    isFullyRevealed () {
      return !!this.current && this.current.revealed.every(Boolean)
    },

    /** Attach an AI-generated briefing { situation, risk, advice, command } */
    setBriefing (briefing) {
      if (!this.current) return
      this.current.briefing = briefing
    },

    /** Push the current draw into history and clear it. */
    commit () {
      if (!this.current?.briefing) return
      this.history.unshift({ ...this.current })
      saveHistory(this.history)
      this.current = null
    },

    /** Wipe all archived draws. */
    clearHistory () {
      this.history = []
      saveHistory(this.history)
    },

    /** Drop the current draw without recording. */
    abandon () {
      this.current = null
    },
  },
})
