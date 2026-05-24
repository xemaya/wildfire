import { defineStore } from 'pinia'
import { drawThree, SYSTEM_KEYS } from '../data/cards.js'

const STORAGE_KEY = 'wf-history-v1'
const UNLOCK_KEY = 'wf-unlocked-v1'
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
    if (!Array.isArray(parsed)) return []
    // 丢弃旧版抽卡记录（卡片用的是已废弃的六分类 key），否则渲染会崩
    return parsed.filter(e =>
      Array.isArray(e?.cards) && e.cards.every(c => SYSTEM_KEYS.includes(c?.system)))
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

/** 已解锁卡 id —— 独立持久化，与历史条数上限脱钩，永不丢失。纯本地，无服务端用户态。 */
function loadUnlocked () {
  try {
    const arr = JSON.parse(localStorage.getItem(UNLOCK_KEY) || '[]')
    return new Set(Array.isArray(arr) ? arr : [])
  } catch { return new Set() }
}
function saveUnlocked (set) {
  try { localStorage.setItem(UNLOCK_KEY, JSON.stringify([...set])) } catch (e) { /* quota */ }
}

export const useDrawStore = defineStore('draw', {
  state: () => ({
    /** the current in-progress draw, or null. */
    current: null,
    /** all completed draws, newest first. Persisted to localStorage. */
    history: loadHistory(),
    /** durable set of unlocked card ids (localStorage, decoupled from history cap). */
    unlocked: loadUnlocked(),
  }),

  getters: {
    /** Set of card ids the user has unlocked (durable set ∪ whatever's still in history). */
    unlockedIds (state) {
      const ids = new Set(state.unlocked)
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

    /** Mark one card as revealed (0–2 in original draw order). Unlocks it durably. */
    reveal (index) {
      if (!this.current) return
      this.current.revealed[index] = true
      const c = this.current.cards[index]
      if (c && !this.unlocked.has(c.id)) {
        this.unlocked.add(c.id)
        saveUnlocked(this.unlocked)
      }
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
