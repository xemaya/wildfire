<template>
  <main class="table" v-if="draw">
    <!-- top bar -->
    <header class="meta">
      <button class="back-btn" @click="onBack" aria-label="返回首页">‹ 首 页</button>
      <span class="title">星 火 · 作 战 桌</span>
      <span class="meta-right">
        <button class="mute" @click="toggleMute" :aria-label="muted ? '取消静音' : '静音'">{{ muted ? '🔇' : '🔊' }}</button>
        <span class="pulse">{{ statusLabel }}</span>
      </span>
    </header>

    <!-- card stage: one focus card + two peeking -->
    <div class="stage">
      <div class="glow" aria-hidden="true"></div>
      <div class="grid-bg" aria-hidden="true"></div>

      <div
        v-for="(card, i) in draw.cards"
        :key="card.id"
        class="slot"
        :class="slotClass(i)"
        @click="onSlotTap(i)"
      >
        <div class="flipper" :class="{ flipped: draw.revealed[i] }">
          <div class="face back">
            <span class="seal" aria-hidden="true">★</span>
            <span class="back-cat">{{ SYSTEMS[card.system].cn }}</span>
          </div>
          <div class="face front">
            <Card :card="card" />
          </div>
        </div>
      </div>
    </div>

    <!-- pager -->
    <nav class="pager" aria-label="切换卡片">
      <button
        v-for="(card, i) in draw.cards"
        :key="card.id"
        class="dot"
        :class="{ active: i === focus, done: draw.revealed[i] }"
        @click="onPager(i)"
      >{{ SYSTEMS[card.system].sym }}</button>
    </nav>

    <p class="caption">{{ caption }}</p>

    <!-- CTA -->
    <button class="cta" :class="{ show: allRevealed }" @click="onView" :disabled="!allRevealed">
      <span class="cta-cn">查 看 战 略 简 报</span>
    </button>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useDrawStore } from '../stores/draw.js'
import { SYSTEMS } from '../data/cards.js'
import Card from '../components/Card.vue'
import { sfx, muted, toggleMute } from '../utils/sfx.js'

const router = useRouter()
const drawStore = useDrawStore()
if (!drawStore.current) router.replace('/')

const draw = computed(() => drawStore.current)
const allRevealed = computed(() => drawStore.isFullyRevealed())

const focus = ref(0) // 形势 first
const caption = ref('— 发 牌 中 —')
const statusLabel = ref('发 牌 中')
const timers = []

function slotClass (i) {
  if (i === focus.value) return 'is-focus'
  // remaining two: left/right by natural index relative to focus
  return i < focus.value ? 'is-left' : 'is-right'
}

onMounted(() => {
  // 依次出牌：形势(0) → 方针(1) → 行动(2)，每张居中翻开、停顿让人看清
  const STEP = 1900
  ;[0, 1, 2].forEach((idx) => {
    timers.push(setTimeout(() => {
      focus.value = idx
      drawStore.reveal(idx)
      sfx.flip()
    }, 500 + idx * STEP))
  })
  timers.push(setTimeout(() => {
    caption.value = '— 轻 点 两 侧 回 看 —'
    statusLabel.value = '简 报 就 绪'
  }, 500 + 2 * STEP + 600))
})
onBeforeUnmount(() => timers.forEach(clearTimeout))

function onSlotTap (i) {
  if (i !== focus.value) { focus.value = i; sfx.switch(); return }
  if (!draw.value.revealed[i]) { drawStore.reveal(i); sfx.flip() }
}
function onPager (i) { if (i !== focus.value) { focus.value = i; sfx.switch() } }
function onView () { sfx.stamp(); router.push('/briefing') }
function onBack () { drawStore.abandon(); router.replace('/') }
</script>

<style scoped>
.table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding:
    max(14px, env(safe-area-inset-top)) 16px
    max(20px, env(safe-area-inset-bottom));
  color: var(--kraft-light);
  background:
    radial-gradient(ellipse 60% 40% at 88% 8%, rgba(214,138,58,.22), transparent 58%),
    radial-gradient(ellipse 90% 60% at 50% 60%, rgba(43,34,22,.5), transparent 70%),
    var(--noise-char),
    linear-gradient(170deg, #241d15 0%, #19140e 55%, #120e09 100%);
  background-blend-mode: screen, multiply, multiply, normal;
}

/* ---------- top bar ---------- */
.meta {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: .28em;
  color: var(--kraft-shadow);
  text-transform: uppercase;
}
.meta .title { font-family: var(--f-display-cn); letter-spacing: .2em; color: var(--kraft-shadow); }
.meta-right { display: inline-flex; align-items: center; gap: 10px; }
.mute { font-size: 13px; opacity: .75; }
.mute:active { opacity: 1; }
.back-btn {
  font-family: var(--f-display-cn);
  font-size: 12px; letter-spacing: .18em;
  color: var(--kraft-shadow);
  padding: 4px 8px; border: 1px solid transparent;
  transition: color .2s, border-color .2s;
}
.back-btn:active { color: var(--kraft-cream); border-color: var(--kraft-shadow); }
.pulse::before {
  content: "●"; color: var(--rust-bright); margin-right: 5px;
  text-shadow: 0 0 6px var(--rust-bright); animation: pulse 1.6s infinite;
}
@keyframes pulse { 0%,40%,100%{opacity:1;} 45%,90%{opacity:.25;} }

/* ---------- stage ---------- */
.stage {
  flex: 1;
  width: 100%;
  position: relative;
  perspective: 1500px;
  overflow: hidden;
}
.glow {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 48% 36% at 50% 46%, rgba(232,214,173,.10), transparent 70%);
}
.grid-bg {
  position: absolute; inset: 0; pointer-events: none; opacity: .5;
  background-image:
    repeating-linear-gradient(0deg, rgba(212,184,134,.06) 0 1px, transparent 1px 30px),
    repeating-linear-gradient(90deg, rgba(212,184,134,.06) 0 1px, transparent 1px 30px);
  -webkit-mask-image: radial-gradient(ellipse 75% 70% at 50% 50%, #000 35%, transparent 80%);
          mask-image: radial-gradient(ellipse 75% 70% at 50% 50%, #000 35%, transparent 80%);
}

/* card slots */
.slot {
  position: absolute;
  top: 50%; left: 50%;
  width: min(80vw, 344px);
  aspect-ratio: 5 / 7;
  transform-origin: center center;
  transition: transform .55s var(--ease-paper), opacity .45s ease, filter .45s ease;
  will-change: transform;
  cursor: pointer;
  animation: deal-in .5s var(--ease-paper) backwards;
}
@keyframes deal-in { from { opacity: 0; transform: translate(-50%, -30%) scale(.8); } }
.slot.is-focus { transform: translate(-50%, -50%) scale(1) rotate(0); z-index: 3; opacity: 1; filter: none; }
.slot.is-left  { transform: translate(calc(-50% - 64%), -49%) scale(.72) rotate(-7deg); z-index: 1; opacity: .4; filter: brightness(.6) saturate(.78); }
.slot.is-right { transform: translate(calc(-50% + 64%), -49%) scale(.72) rotate(7deg);  z-index: 1; opacity: .4; filter: brightness(.6) saturate(.78); }

.flipper {
  position: relative;
  width: 100%; height: 100%;
  transform-style: preserve-3d;
  transition: transform 520ms var(--ease-flip);
}
.flipper.flipped { transform: rotateY(180deg); }
.face {
  position: absolute; inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,.5), 0 18px 30px -10px rgba(0,0,0,.55);
}
/* back */
.back {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;
  border: 1px solid var(--ink-black);
  background: radial-gradient(circle at 50% 42%, var(--kraft-deep), var(--kraft-darker) 62%, var(--kraft-shadow) 100%), var(--noise-kraft);
  background-blend-mode: multiply;
}
.back::before { content: ""; position: absolute; inset: 6px; border: 1px dashed rgba(20,17,13,.4); }
.back .seal {
  width: 52px; height: 52px; border: 2px solid var(--rust); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--rust); font-family: var(--f-display-cn); font-size: 24px;
  mix-blend-mode: multiply;
}
.back .back-cat { font-family: var(--f-display-cn); font-size: 15px; letter-spacing: .3em; color: var(--ink-black); opacity: .65; }
/* front holds <Card> */
.front { transform: rotateY(180deg); }
.front :deep(.wf-card) { height: 100%; }

/* ---------- pager ---------- */
.pager { display: flex; gap: 12px; margin-top: 6px; }
.dot {
  width: 30px; height: 30px;
  border: 1px solid var(--kraft-shadow);
  background: transparent;
  color: var(--kraft-shadow);
  font-family: var(--f-display-cn); font-size: 13px;
  display: flex; align-items: center; justify-content: center;
  transition: all .25s ease;
}
.dot.done { color: var(--kraft-light); border-color: var(--kraft-edge); }
.dot.active { color: var(--kraft-cream); border-color: var(--rust); background: rgba(155,42,26,.16); box-shadow: 0 0 0 1px var(--rust); }

/* ---------- caption ---------- */
.caption {
  margin: 8px 0 4px;
  font-family: var(--f-mono);
  font-size: 10px; letter-spacing: .36em;
  color: var(--rust); text-transform: uppercase;
}

/* ---------- CTA (stamp) ---------- */
.cta {
  position: relative;
  margin-top: 6px;
  padding: 13px 30px;
  border: 2px solid var(--rust);
  background: rgba(155,42,26,.1);
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  box-shadow: 0 3px 0 rgba(0,0,0,.3), inset 0 0 0 1px rgba(155,42,26,.4);
  transform: rotate(-1deg) translateY(8px);
  opacity: 0; pointer-events: none;
  transition: opacity .45s ease, transform .45s var(--ease-paper);
}
.cta.show { opacity: 1; transform: rotate(-1deg) translateY(0); pointer-events: auto; }
.cta:active { transform: rotate(-1deg) translateY(2px) scale(.99); }
.cta-cn { font-family: var(--f-display-cn); font-size: 19px; letter-spacing: .22em; color: var(--rust-bright); }
.cta-en { font-family: var(--f-mono); font-size: 8px; letter-spacing: .34em; color: var(--rust); text-transform: uppercase; }
</style>
