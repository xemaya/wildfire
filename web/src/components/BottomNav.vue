<template>
  <nav class="bottom-nav">
    <button
      v-for="t in tabs"
      :key="t.path"
      class="tab"
      :class="{ active: isActive(t) }"
      @click="go(t)"
    >
      <span class="ico" v-html="t.ico" aria-hidden="true"></span>
      <span class="lbl">{{ t.label }}</span>
    </button>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useDrawStore } from '../stores/draw.js'
import { sfx } from '../utils/sfx.js'

const route = useRoute()
const router = useRouter()
const drawStore = useDrawStore()

const tabs = [
  { label: '抽 卡', path: '/', name: 'home', ico: '◵' },
  { label: '档案库', path: '/archive', name: 'archive', ico: '▤' },
  { label: '时间线', path: '/timeline', name: 'timeline', ico: '⌗' },
]

function isActive (t) { return route.name === t.name }
function go (t) {
  sfx.switch()
  if (t.name === 'home') { drawStore.abandon?.() }
  if (route.path !== t.path) router.push(t.path)
}
</script>

<style scoped>
.bottom-nav {
  flex: 0 0 auto;
  display: flex;
  align-items: stretch;
  border-top: 1px solid var(--kraft-edge);
  background:
    linear-gradient(180deg, rgba(28,22,15,.96), rgba(16,12,8,.98)),
    var(--noise-char);
  background-blend-mode: multiply;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -6px 16px -8px rgba(0,0,0,.6);
}
.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 9px 0 8px;
  color: var(--kraft-shadow);
  transition: color .2s ease;
  position: relative;
}
.tab .ico { font-size: 19px; line-height: 1; }
.tab .lbl { font-family: var(--f-display-cn); font-size: 11px; letter-spacing: .14em; }
.tab.active { color: var(--kraft-cream); }
.tab.active::before {
  content: "";
  position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 26px; height: 2px; background: var(--rust-bright);
  box-shadow: 0 0 8px var(--rust-bright);
}
.tab:active { color: var(--kraft-light); }
</style>
