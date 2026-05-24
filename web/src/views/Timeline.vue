<template>
  <main class="timeline">
    <h1 class="title">
      <span class="cn">战 略 时 间 线</span>
      <span class="en">共 {{ history.length }} 次 推 演</span>
    </h1>

    <!-- empty state -->
    <div v-if="!history.length" class="empty">
      <div class="empty-cn">尚 无 档 案</div>
      <div class="empty-en">— 暂 无 推 演 记 录 —</div>
      <button class="empty-cta" @click="onDraw">开 始 抽 卡</button>
    </div>

    <!-- chronological entries -->
    <ol v-else class="entries">
      <li
        v-for="entry in history"
        :key="entry.id"
        class="entry"
      >
        <div class="entry-date">{{ formatDate(entry.drawnAt) }}</div>
        <div class="entry-time">{{ formatTime(entry.drawnAt) }}</div>

        <div class="entry-cards">
          <span
            v-for="card in entry.cards"
            :key="card.id"
            class="entry-chip"
          >
            <span class="chip-sys">{{ sysOf(card.system).sym }}</span>
            <span class="chip-name">{{ card.title }}</span>
          </span>
        </div>

        <div class="entry-command" v-if="entry.briefing?.command">
          <span class="cmd-mark">令</span>
          {{ entry.briefing.command }}
        </div>
      </li>
    </ol>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDrawStore } from '../stores/draw.js'
import { sysOf } from '../data/cards.js'

const router = useRouter()
const drawStore = useDrawStore()

const history = computed(() => drawStore.history)

function formatDate (iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}
function formatTime (iso) {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function onBack () { router.replace('/') }
function onDraw () {
  drawStore.begin()
  router.push('/draw')
}
</script>

<style scoped>
.timeline {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding:
    max(18px, env(safe-area-inset-top))
    24px
    max(24px, env(safe-area-inset-bottom));
  color: var(--kraft-light);
  overflow-y: auto;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: .32em;
  color: var(--kraft-shadow);
  text-transform: uppercase;
}
.back-btn {
  font-family: var(--f-display-cn);
  font-size: 11px;
  letter-spacing: .2em;
  color: var(--kraft-shadow);
  padding: 4px 8px;
}
.back-btn:active { color: var(--kraft-cream); }

.title {
  text-align: center;
  margin: 18px 0 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--kraft-shadow);
}
.title .cn {
  font-family: var(--f-display-cn);
  font-size: 28px;
  letter-spacing: .26em;
  color: var(--kraft-cream);
  display: block;
  line-height: 1;
}
.title .en {
  font-family: var(--f-display-en);
  font-size: 11px;
  letter-spacing: .4em;
  color: var(--rust-bright);
  text-transform: uppercase;
  margin-top: 6px;
  display: block;
}

/* empty state */
.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 6px;
  padding-bottom: 14vh;
}
.empty-cn {
  font-family: var(--f-display-cn);
  font-size: 32px;
  letter-spacing: .36em;
  color: var(--kraft-shadow);
}
.empty-en {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: .5em;
  color: var(--rust);
  margin-bottom: 32px;
}
.empty-cta {
  border: 2px solid var(--rust);
  padding: 14px 36px;
  font-family: var(--f-display-cn);
  font-size: 18px;
  letter-spacing: .3em;
  color: var(--kraft-cream);
  background: rgba(155,42,26,.06);
  box-shadow: 0 3px 0 rgba(0,0,0,.3);
}

/* entries list */
.entries {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.entry {
  position: relative;
  padding: 14px 14px 14px 22px;
  background: rgba(212,184,134,.04);
  border: 1px solid rgba(212,184,134,.18);
  border-left: 2px solid var(--rust);
}
.entry-date {
  font-family: var(--f-mono);
  font-size: 11px;
  letter-spacing: .32em;
  color: var(--rust);
  text-transform: uppercase;
  margin-bottom: 2px;
}
.entry-time {
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: .22em;
  color: var(--kraft-shadow);
  margin-bottom: 10px;
}

.entry-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}
.entry-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  background: var(--kraft);
  color: var(--ink-black);
  border: 1px solid var(--kraft-edge);
}
.chip-sys {
  width: 16px; height: 16px;
  border: 1px solid var(--rust);
  color: var(--rust);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--f-display-cn);
  font-size: 10px;
}
.chip-name {
  font-family: var(--f-display-cn);
  font-size: 13px;
  letter-spacing: .04em;
  line-height: 1;
}

.entry-command {
  font-family: var(--f-brush);
  color: var(--rust-bright);
  font-size: 16px;
  line-height: 1.5;
  padding-top: 8px;
  border-top: 1px dashed var(--kraft-edge);
  display: flex;
  align-items: center;
  gap: 8px;
}
.cmd-mark {
  font-family: var(--f-display-cn);
  color: var(--rust);
  border: 1.5px solid var(--rust);
  font-size: 12px;
  padding: 2px 6px;
  letter-spacing: 0;
}

/* small screens */
@media (max-width: 380px) {
  .title .cn { font-size: 24px; letter-spacing: .2em; }
  .chip-name { font-size: 12px; }
  .entry-command { font-size: 14px; }
}
</style>
