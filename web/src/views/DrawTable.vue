<template>
  <main class="table" v-if="draw">
    <header class="meta">
      <button class="back-btn" @click="onBack" aria-label="返回首页">‹ 首 页</button>
      <span class="pulse">{{ statusLabel }}</span>
      <span>WF · 作 战 桌</span>
    </header>

    <div class="desk">
      <div class="grid-bg"></div>

      <div class="cards">
        <div
          v-for="(card, i) in draw.cards"
          :key="card.id"
          class="card-slot"
          :style="{ '--i': i }"
        >
          <article
            class="card"
            :class="{ flipped: draw.revealed[i] }"
            :style="{ '--rot': cardTilts[i] + 'deg' }"
            @click="onCardTap(i)"
          >
            <!-- BACK -->
            <div class="face back">
              <div class="seal" aria-hidden="true">★</div>
            </div>
            <!-- FRONT -->
            <div class="face front">
              <div class="strip">
                <span class="strip-name">{{ card.title }}</span>
              </div>
              <div class="body">
                <span class="sym">{{ SYSTEMS[card.system].sym }}</span>
                <span class="sys-en">{{ SYSTEMS[card.system].en }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div class="caption">{{ caption }}</div>
    </div>

    <button v-if="allRevealed" class="cta" @click="onView">
      <span class="cta-cn">查 看 战 略 简 报</span>
      <span class="cta-en">View Briefing</span>
    </button>

    <CardOverlay :card="selected" @close="selected = null" />
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useDrawStore } from '../stores/draw.js'
import { SYSTEMS } from '../data/cards.js'
import CardOverlay from '../components/CardOverlay.vue'

const router = useRouter()
const drawStore = useDrawStore()

// bounce back to home if no current draw
if (!drawStore.current) router.replace('/')

const draw = computed(() => drawStore.current)
const allRevealed = computed(() => drawStore.isFullyRevealed())

// slight tilt per card position for hand-of-cards feel
const cardTilts = [-4, 0.5, 4]
const caption = ref('— 翻 牌 中 · FLIPPING —')
const statusLabel = ref('DEALING')
const timers = []

onMounted(() => {
  // schedule 3 flips in RANDOM ORDER, 800ms apart, first flip 600ms after mount
  const order = [0, 1, 2].sort(() => Math.random() - 0.5)
  order.forEach((idx, i) => {
    const t = setTimeout(() => {
      drawStore.reveal(idx)
      // last flip: switch status
      if (i === order.length - 1) {
        const t2 = setTimeout(() => {
          caption.value = '— 轻 点 卡 片 看 全 文 —'
          statusLabel.value = 'BRIEFING READY'
        }, 480)
        timers.push(t2)
      }
    }, 600 + i * 800)
    timers.push(t)
  })
})

onBeforeUnmount(() => {
  timers.forEach(clearTimeout)
})

// before reveal: tapping flips early. after reveal: tapping opens the full card.
const selected = ref(null)
function onCardTap (i) {
  if (!draw.value.revealed[i]) {
    drawStore.reveal(i)
  } else {
    selected.value = draw.value.cards[i]
  }
}

function onView () {
  router.push('/briefing')
}

function onBack () {
  drawStore.abandon()
  router.replace('/')
}
</script>

<style scoped>
.table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding:
    max(18px, env(safe-area-inset-top))
    24px
    max(28px, env(safe-area-inset-bottom));
  color: var(--kraft-light);
}

/* ---------- meta strip ---------- */
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
.back-btn {
  font-family: var(--f-display-cn);
  font-size: 11px;
  letter-spacing: .2em;
  color: var(--kraft-shadow);
  padding: 4px 8px;
  border: 1px solid transparent;
  transition: border-color .2s ease, color .2s ease;
}
.back-btn:active { color: var(--kraft-cream); border-color: var(--kraft-shadow); }

.pulse::before {
  content: "●";
  color: var(--rust-bright);
  margin-right: 5px;
  text-shadow: 0 0 6px var(--rust-bright);
  animation: pulse 1.6s infinite;
}
@keyframes pulse {
  0%, 40%, 100% { opacity: 1; }
  45%, 90% { opacity: .25; }
}

/* ---------- desk surface ---------- */
.desk {
  flex: 1;
  width: 100%;
  margin-top: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(212,184,134,.18);
  background:
    radial-gradient(ellipse 70% 50% at 50% 50%, rgba(232,214,173,.05), transparent 70%);
}
/* faint coordinate grid like a map */
.grid-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(0deg, rgba(212,184,134,.06) 0 1px, transparent 1px 28px),
    repeating-linear-gradient(90deg, rgba(212,184,134,.06) 0 1px, transparent 1px 28px);
  opacity: .9;
}

/* ---------- 3-card row ---------- */
.cards {
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: center;
  perspective: 1300px;
  padding: 24px 4px;
  position: relative;
  z-index: 1;
}

/* deal-in: each card-slot rises into place, staggered (transform here so it
   never collides with the flip transform on the inner .card) */
.card-slot {
  animation: deal-in .5s var(--ease-paper) backwards;
  animation-delay: calc(var(--i) * 0.1s);
}
@keyframes deal-in {
  from { opacity: 0; transform: translateY(44px) rotate(-2deg); }
  to   { opacity: 1; transform: translateY(0) rotate(0); }
}

.card {
  --w: 96px;
  --h: 134px;
  width: var(--w);
  height: var(--h);
  position: relative;
  transform: rotate(var(--rot, 0deg));
  transition: transform 440ms var(--ease-flip);
  transform-style: preserve-3d;
  cursor: pointer;
}
.card.flipped {
  transform: rotate(var(--rot, 0deg)) rotateY(180deg);
}

.face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border: 1px solid var(--ink-black);
  display: flex;
  overflow: hidden;
  /* shadow lives on each face (filter would break 3D — known stacking-context bug) */
  box-shadow:
    0 2px 0 rgba(0,0,0,.25),
    0 6px 10px rgba(0,0,0,.55),
    0 14px 20px -6px rgba(0,0,0,.35);
}

/* CARD BACK */
.back {
  background:
    radial-gradient(circle at 50% 50%, var(--kraft-deep) 0%, var(--kraft-darker) 65%, var(--kraft-shadow) 100%),
    var(--noise-kraft);
  background-blend-mode: multiply;
  align-items: center;
  justify-content: center;
  box-shadow:
    inset 0 0 0 1px rgba(232,214,173,.2),
    inset 0 0 22px -10px rgba(0,0,0,.45);
}
.back::before, .back::after {
  content: "";
  position: absolute;
  border: 1px solid rgba(20,17,13,.4);
}
.back::before { inset: 4px; }
.back::after  { inset: 8px; border-style: dashed; opacity: .6; }
.back .seal {
  width: 44px;
  height: 44px;
  border: 2px solid var(--rust);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--rust);
  font-family: var(--f-display-cn);
  font-size: 22px;
  mix-blend-mode: multiply;
  opacity: 0.86;
  z-index: 1;
  filter: contrast(1.1);
}
.back .seal::before {
  content: "";
  position: absolute;
  inset: 4px;
  border: 1px solid currentColor;
  border-radius: 50%;
}

/* CARD FRONT */
.front {
  transform: rotateY(180deg);
  background:
    radial-gradient(ellipse 90% 60% at 50% 0%, rgba(232,214,173,.55), transparent 60%),
    var(--noise-kraft),
    var(--kraft);
  background-blend-mode: multiply, multiply, normal;
  gap: 0;
}
.front .strip {
  width: 26px;
  background: linear-gradient(180deg, var(--kraft-deep), var(--kraft-darker));
  border-right: 1px solid var(--ink-black);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 0;
  position: relative;
}
.front .strip::before, .front .strip::after {
  content: "";
  position: absolute;
  width: 4px; height: 4px;
  border: 1px solid var(--ink-black);
}
.front .strip::before { top: 3px; left: 3px; border-right: none; border-bottom: none; }
.front .strip::after  { bottom: 3px; right: 3px; border-left: none; border-top: none; }

.front .strip-name {
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-family: var(--f-display-cn);
  font-size: 15px;
  letter-spacing: .14em;
  color: var(--ink-black);
}

.front .body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.front .body .sym {
  width: 28px; height: 28px;
  border: 1.5px solid var(--rust);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--f-display-cn);
  font-size: 16px;
  color: var(--rust);
}
.front .body .sys-en {
  font-family: var(--f-display-en);
  font-size: 8px;
  letter-spacing: .3em;
  color: var(--ink-hand);
  text-transform: uppercase;
  opacity: .8;
}

/* ---------- caption under desk ---------- */
.caption {
  position: absolute;
  bottom: 18px;
  left: 0; right: 0;
  text-align: center;
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: .42em;
  color: var(--rust);
  text-transform: uppercase;
  z-index: 1;
}

/* ---------- CTA ---------- */
.cta {
  margin-top: 20px;
  position: relative;
  border: 2px solid var(--rust);
  padding: 16px 32px;
  background: rgba(155,42,26,.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: 0 3px 0 rgba(0,0,0,.3);
  transition:
    transform .25s var(--ease-paper),
    background .25s ease,
    box-shadow .25s ease,
    opacity .4s ease;
  animation: fadeUp .5s var(--ease-paper);
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.cta:active {
  transform: translateY(2px);
  background: rgba(155,42,26,.2);
  box-shadow: 0 1px 0 rgba(0,0,0,.3);
}
.cta::before, .cta::after {
  content: "";
  position: absolute;
  width: 12px; height: 12px;
  border: 2px solid var(--rust);
}
.cta::before { top: -3px; left: -3px; border-right: none; border-bottom: none; }
.cta::after  { bottom: -3px; right: -3px; border-left: none; border-top: none; }
.cta-cn {
  font-family: var(--f-display-cn);
  font-size: 18px;
  letter-spacing: .28em;
  color: var(--kraft-cream);
}
.cta-en {
  font-family: var(--f-display-en);
  font-size: 10px;
  letter-spacing: .42em;
  color: var(--rust);
  text-transform: uppercase;
}

/* ---------- small screens ---------- */
@media (max-width: 380px) {
  .card { --w: 86px; --h: 122px; }
  .front .strip-name { font-size: 13px; }
}
@media (max-height: 700px) {
  .desk { margin-top: 12px; }
}
</style>
