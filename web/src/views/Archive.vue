<template>
  <main class="archive">
    <h1 class="title">
      <span class="cn">战 略 档 案 库</span>
      <span class="en">已 解 锁 {{ unlockedCount }} / {{ totalCount }}</span>
    </h1>

    <section v-for="(group, sysKey) in CARDS_BY_SYSTEM" :key="sysKey" class="sys-section">
      <div class="sys-head">
        <span class="sym">{{ SYSTEMS[sysKey].sym }}</span>
        <span class="name">{{ SYSTEMS[sysKey].cn }}</span>
        <span class="count">{{ unlockedInSystem(sysKey) }} / {{ group.length }}</span>
      </div>
      <div class="grid">
        <button
          v-for="card in group"
          :key="card.id"
          class="cell"
          :class="{ unlocked: isUnlocked(card.id) }"
          @click="onCardTap(card)"
        >
          <Card :card="card" :locked="!isUnlocked(card.id)" compact />
        </button>
      </div>
    </section>

    <!-- detail overlay -->
    <CardOverlay :card="selected" @close="selected = null" />
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDrawStore } from '../stores/draw.js'
import { CARDS_BY_SYSTEM, SYSTEMS, ALL_CARDS } from '../data/cards.js'
import Card from '../components/Card.vue'
import CardOverlay from '../components/CardOverlay.vue'

const router = useRouter()
const drawStore = useDrawStore()

const totalCount = ALL_CARDS.length
const unlockedCount = computed(() => drawStore.unlockedCount)

function isUnlocked (id) {
  return drawStore.unlockedIds.has(id)
}
function unlockedInSystem (sysKey) {
  return CARDS_BY_SYSTEM[sysKey].filter(c => isUnlocked(c.id)).length
}

const selected = ref(null)
function onCardTap (card) {
  if (isUnlocked(card.id)) selected.value = card
}

function onBack () { router.replace('/') }
</script>

<style scoped>
.archive {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding:
    max(18px, env(safe-area-inset-top))
    20px
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
  margin: 16px 0 22px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--kraft-shadow);
}
.title .cn {
  font-family: var(--f-display-cn);
  font-size: 28px;
  letter-spacing: .24em;
  color: var(--kraft-cream);
  display: block;
  line-height: 1;
}
.title .en {
  font-family: var(--f-display-en);
  font-size: 11px;
  letter-spacing: .38em;
  color: var(--rust-bright);
  text-transform: uppercase;
  margin-top: 6px;
  display: block;
}

/* system sections */
.sys-section { margin-bottom: 28px; }
.sys-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed rgba(212,184,134,.2);
}
.sys-head .sym {
  width: 26px; height: 26px;
  border: 1.5px solid var(--rust);
  color: var(--rust);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--f-display-cn);
  font-size: 14px;
}
.sys-head .name {
  font-family: var(--f-display-cn);
  font-size: 18px;
  letter-spacing: .16em;
  color: var(--kraft-cream);
}
.sys-head .en {
  font-family: var(--f-display-en);
  font-size: 10px;
  letter-spacing: .32em;
  color: var(--rust-bright);
  text-transform: uppercase;
}
.sys-head .count {
  margin-left: auto;
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: .22em;
  color: var(--kraft-shadow);
}

/* grid of cards */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.cell {
  padding: 0;
  background: none;
  border: none;
  display: block;
  transition: transform .2s var(--ease-paper);
}
.cell.unlocked:active { transform: scale(.96); }
.cell:not(.unlocked) { cursor: default; }

@media (max-width: 380px) {
  .title .cn { font-size: 24px; }
  .grid { gap: 8px; }
}
</style>
