<template>
  <main class="home">
    <header class="meta">
      <span>WF · {{ todayLabel }}</span>
      <nav class="nav-links">
        <button class="nav-link" type="button" @click="go('/timeline')">时 间 线</button>
        <span class="nav-sep">·</span>
        <button class="nav-link" type="button" @click="go('/archive')">档 案 库</button>
      </nav>
    </header>

    <section class="brand">
      <h1 class="brand-cn">星火</h1>
      <div class="brand-en">WILDFIRE</div>
      <div class="brand-slogan">遇 事 不 决 · 抽 卡 毛 选</div>
    </section>

    <button class="cta" type="button" @click="onDraw">
      <span class="cta-cn">开 始 抽 卡</span>
      <span class="cta-en">Draw · Three Cards</span>
    </button>

    <footer class="order">
      <div class="order-label">— 今 日 军 令 —</div>
      <div class="order-text">{{ dailyOrder }}</div>
    </footer>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDrawStore } from '../stores/draw.js'
import { randomOrder } from '../data/orders.js'

const router = useRouter()
const drawStore = useDrawStore()

const dailyOrder = ref(randomOrder())

const todayLabel = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
})

function onDraw () {
  drawStore.begin()
  router.push('/draw')
}

function go (path) {
  router.push(path)
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding:
    max(20px, env(safe-area-inset-top))
    28px
    max(28px, env(safe-area-inset-bottom));
  position: relative;
  color: var(--kraft-light);
}

/* ---------- top meta line ---------- */
.meta {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: .32em;
  color: var(--kraft-shadow);
  text-transform: uppercase;
}
.nav-links {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.nav-link {
  font-family: var(--f-display-cn);
  font-size: 12px;
  letter-spacing: .2em;
  color: var(--kraft-shadow);
  padding: 4px 2px;
  transition: color .2s ease;
}
.nav-link:active { color: var(--kraft-cream); }
.nav-sep { color: var(--kraft-shadow); opacity: .5; }

/* ---------- brand block ---------- */
.brand {
  margin-top: 13vh;
  text-align: center;
}
.brand-cn {
  font-family: var(--f-display-cn);
  font-size: 104px;
  letter-spacing: .14em;
  color: var(--kraft-cream);
  font-weight: 400;
  line-height: 1;
  text-shadow:
    0 2px 0 rgba(0,0,0,.5),
    0 0 28px rgba(244,212,151,.12);
}
.brand-en {
  font-family: var(--f-display-en);
  font-size: 15px;
  letter-spacing: .55em;
  color: var(--rust-bright);
  text-transform: uppercase;
  margin-top: 12px;
  font-weight: 400;
}
.brand-slogan {
  font-family: var(--f-display-cn);
  font-size: 15px;
  letter-spacing: .42em;
  color: var(--kraft-shadow);
  margin-top: 26px;
}

/* ---------- CTA ---------- */
.cta {
  margin-top: auto;
  margin-bottom: 32px;
  position: relative;
  border: 2px solid var(--rust);
  padding: 22px 56px;
  background: rgba(155,42,26,.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  transition:
    transform .25s var(--ease-paper),
    background .25s ease,
    box-shadow .25s ease;
  box-shadow: 0 4px 0 rgba(0,0,0,.3);
}
.cta:active {
  transform: translateY(2px);
  background: rgba(155,42,26,.18);
  box-shadow: 0 2px 0 rgba(0,0,0,.3);
  animation: none;
}
/* restrained idle breath — telegraph-lamp glow draws the eye to the one action */
.cta {
  animation: cta-breathe 3s ease-in-out infinite;
}
@keyframes cta-breathe {
  0%, 100% { box-shadow: 0 4px 0 rgba(0,0,0,.3), 0 0 0 rgba(181,50,33,0); }
  50%      { box-shadow: 0 4px 0 rgba(0,0,0,.3), 0 0 24px rgba(181,50,33,.22); }
}
@media (prefers-reduced-motion: reduce) {
  .cta { animation: none; }
}
.cta::before, .cta::after {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  border: 2px solid var(--rust);
}
.cta::before { top: -3px; left: -3px; border-right: none; border-bottom: none; }
.cta::after  { bottom: -3px; right: -3px; border-left: none; border-top: none; }

.cta-cn {
  font-family: var(--f-display-cn);
  font-size: 26px;
  letter-spacing: .34em;
  color: var(--kraft-cream);
  line-height: 1;
}
.cta-en {
  font-family: var(--f-display-en);
  font-size: 11px;
  letter-spacing: .42em;
  color: var(--rust);
  text-transform: uppercase;
  line-height: 1;
}

/* ---------- footer order ---------- */
.order {
  width: 100%;
  text-align: center;
  padding-top: 18px;
  border-top: 1px dashed rgba(212,184,134,.22);
}
.order-label {
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: .44em;
  color: var(--rust);
  text-transform: uppercase;
  margin-bottom: 10px;
}
.order-text {
  font-family: var(--f-brush);
  font-size: 20px;
  color: var(--kraft-light);
  line-height: 1.5;
  opacity: .9;
}

/* ---------- small screens (≤375px / iPhone SE) ---------- */
@media (max-width: 380px) {
  .brand-cn { font-size: 88px; }
  .cta { padding: 18px 44px; }
  .cta-cn { font-size: 22px; letter-spacing: .3em; }
  .order-text { font-size: 18px; }
}

/* ---------- short screens ---------- */
@media (max-height: 700px) {
  .brand { margin-top: 8vh; }
  .brand-cn { font-size: 80px; }
  .cta { margin-bottom: 22px; }
}
</style>
