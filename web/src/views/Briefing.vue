<template>
  <main class="brief" v-if="draw">
    <header class="meta">
      <span>星 火 · 战 略 简 报</span>
      <span class="pulse">{{ loading ? '接 收 中' : (source === 'ai' ? '电 报 已 达' : '本 地 推 演') }}</span>
    </header>

    <h1 class="title">
      <span class="cn">战 略 简 报</span>
    </h1>

    <!-- the 3 drawn cards, tappable chips -->
    <div class="chips">
      <button
        v-for="card in draw.cards"
        :key="card.id"
        class="chip"
        @click="selected = card"
      >
        <span class="chip-sys">{{ SYSTEMS[card.system].sym }}</span>
        <span class="chip-name">{{ card.title }}</span>
      </button>
    </div>

    <!-- loading: telegram receiving -->
    <div v-if="loading" class="loading">
      <div class="tele-cn">电 报 接 收 中</div>
      <div class="dots"><span></span><span></span><span></span></div>
      <div class="tele-en">— 前 线 拍 报 —</div>
    </div>

    <template v-else>
      <!-- 4 fields -->
      <section class="entry">
        <div class="label"><span class="cn">当前局势</span></div>
        <p class="body">{{ briefing.situation }}</p>
      </section>

      <section class="entry">
        <div class="label"><span class="cn">当前风险</span></div>
        <p class="body">{{ briefing.risk }}</p>
      </section>

      <section class="entry">
        <div class="label"><span class="cn">当前建议</span></div>
        <p class="body">{{ briefing.advice }}</p>
      </section>

      <!-- daily order: visually distinct, stamped -->
      <section class="command">
        <span class="cmd-mark">令</span>
        <div class="cmd-label">— 今 日 军 令 —</div>
        <p class="cmd-text">{{ briefing.command }}</p>
      </section>

      <div class="actions">
        <!-- P0: archive is the completion action — give it the weight -->
        <button class="btn-archive" @click="onArchive">
          <span class="cn">归 档 入 库</span>
        </button>
        <!-- secondary row -->
        <div class="actions-sub">
          <button class="btn-sub" @click="onShare" :disabled="sharing">
            {{ sharing ? '生成中…' : '分 享 图' }}
          </button>
          <button class="btn-sub" @click="onAgain">再 抽 一 次</button>
        </div>
      </div>
    </template>

    <!-- tap a chip to read the full card -->
    <CardOverlay :card="selected" @close="selected = null" />

    <!-- offscreen capture target -->
    <div class="capture-host" ref="captureHost" aria-hidden="true">
      <ShareCard
        v-if="draw && !loading"
        :cards="draw.cards"
        :briefing="briefing"
        :date="dateLabel"
      />
    </div>

    <!-- share preview modal -->
    <Transition name="overlay">
      <div v-if="shareImg" class="share-modal" @click.self="shareImg = null">
        <img :src="shareImg" class="share-preview" alt="战略简报分享图">
        <div class="share-actions">
          <button class="btn-primary" @click="onSave">保 存 / 分 享</button>
          <button class="btn-ghost" @click="shareImg = null">关 闭</button>
        </div>
        <div class="share-hint">长按图片亦可保存</div>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { domToPng } from 'modern-screenshot'
import { useDrawStore } from '../stores/draw.js'
import { SYSTEMS } from '../data/cards.js'
import { fetchBriefing } from '../api/briefing.js'
import ShareCard from '../components/ShareCard.vue'
import CardOverlay from '../components/CardOverlay.vue'

const router = useRouter()
const drawStore = useDrawStore()

if (!drawStore.current) {
  router.replace('/')
}

const draw = computed(() => drawStore.current)
const briefing = ref({ situation: '', risk: '', advice: '', command: '' })
const loading = ref(true)
const source = ref('ai')
const selected = ref(null)

const dateLabel = computed(() => {
  const d = drawStore.current ? new Date(drawStore.current.drawnAt) : new Date()
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
})

onMounted(async () => {
  if (!drawStore.current) return
  // already generated (e.g. returning to the screen) — reuse
  if (drawStore.current.briefing) {
    briefing.value = drawStore.current.briefing
    loading.value = false
    return
  }
  loading.value = true
  // 近期最多 5 次抽卡（不含本次），喂给参谋做连续性判断
  const recent = drawStore.history.slice(0, 5).map(h => ({
    日期: (h.drawnAt || '').slice(0, 10),
    三卡: h.cards.map(c => ({ 类: SYSTEMS[c.system]?.cn || c.system, 语: c.desc || c.quote })),
  }))
  const { briefing: b, source: s } = await fetchBriefing(drawStore.current.cards, recent)
  briefing.value = b
  source.value = s
  drawStore.setBriefing(b)
  loading.value = false
})

/* ---------- share-to-image ---------- */
const captureHost = ref(null)
const shareImg = ref(null)
const sharing = ref(false)

async function onShare () {
  if (sharing.value || loading.value) return
  sharing.value = true
  try {
    await document.fonts.ready
    const node = captureHost.value?.firstElementChild
    if (!node) throw new Error('no capture node')
    shareImg.value = await domToPng(node, {
      scale: 2,
      backgroundColor: '#d4b886',
    })
  } catch (e) {
    console.error('[WF] share capture failed', e)
    alert('生成分享图失败，请重试')
  } finally {
    sharing.value = false
  }
}

async function onSave () {
  if (!shareImg.value) return
  try {
    const blob = await (await fetch(shareImg.value)).blob()
    const file = new File([blob], 'wildfire-briefing.png', { type: 'image/png' })
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: '星火 · 战略简报' })
      return
    }
  } catch (e) {
    // share cancelled or unsupported — fall through to download
  }
  const a = document.createElement('a')
  a.href = shareImg.value
  a.download = 'wildfire-briefing.png'
  a.click()
}

function onArchive () {
  drawStore.commit()
  router.replace('/')
}

function onAgain () {
  drawStore.abandon()
  drawStore.begin()
  router.replace('/draw')
}
</script>

<style scoped>
.brief {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding:
    max(18px, env(safe-area-inset-top))
    24px
    max(24px, env(safe-area-inset-bottom));
  color: var(--kraft-light);
  overflow-y: auto;
}

/* meta */
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

/* title */
.title {
  margin: 18px 0 14px;
  text-align: center;
  border-bottom: 1px solid var(--kraft-shadow);
  padding-bottom: 12px;
  width: 100%;
}
.title .cn {
  font-family: var(--f-display-cn);
  font-size: 32px;
  letter-spacing: .26em;
  color: var(--kraft-cream);
  display: block;
  line-height: 1;
}
.title .en {
  font-family: var(--f-display-en);
  font-size: 12px;
  letter-spacing: .42em;
  color: var(--rust-bright);
  text-transform: uppercase;
  margin-top: 6px;
  display: block;
}

/* 3 card chips */
.chips {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  width: 100%;
  justify-content: center;
}
.chip {
  flex: 0 1 30%;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  background: rgba(212,184,134,.08);
  border: 1px solid var(--kraft-shadow);
  border-left: 3px solid var(--rust);
  transition: transform .2s var(--ease-paper), background .2s ease;
}
.chip:active { transform: translateY(1px); background: rgba(212,184,134,.18); }
.chip-sys {
  width: 20px; height: 20px;
  border: 1px solid var(--rust);
  color: var(--rust);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--f-display-cn);
  font-size: 12px;
  flex-shrink: 0;
}
.chip-name {
  font-family: var(--f-display-cn);
  font-size: 14px;
  letter-spacing: .04em;
  color: var(--kraft-cream);
  line-height: 1;
}

/* loading — telegram receiving */
.loading {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 12vh 0;
}
.tele-cn {
  font-family: var(--f-display-cn);
  font-size: 24px;
  letter-spacing: .4em;
  color: var(--kraft-cream);
}
.tele-en {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: .42em;
  color: var(--rust);
  text-transform: uppercase;
}
.dots {
  display: flex;
  gap: 10px;
}
.dots span {
  width: 8px; height: 8px;
  background: var(--rust-bright);
  box-shadow: 0 0 8px var(--rust-bright);
  animation: blip 1.2s infinite;
}
.dots span:nth-child(2) { animation-delay: .2s; }
.dots span:nth-child(3) { animation-delay: .4s; }
@keyframes blip {
  0%, 60%, 100% { opacity: .2; transform: scale(.8); }
  30% { opacity: 1; transform: scale(1); }
}

/* 4 entries */
.entry {
  width: 100%;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px dashed rgba(212,184,134,.18);
}
.entry .label {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 6px;
  font-family: var(--f-mono);
  font-size: 9.5px;
  letter-spacing: .32em;
  color: var(--rust);
  text-transform: uppercase;
}
.entry .label .cn {
  font-family: var(--f-display-cn);
  font-size: 13px;
  letter-spacing: .16em;
  color: var(--kraft-cream);
  text-transform: none;
}
.entry .body {
  font-family: var(--f-body-cn);
  font-size: 16px;
  line-height: 1.85;
  color: var(--kraft-light);
  padding-left: 2px;
}

/* daily order — stamped command */
.command {
  width: 100%;
  margin: 6px 0 22px;
  padding: 28px 18px 22px;
  border: 2px solid var(--rust);
  background:
    repeating-linear-gradient(45deg, transparent 0 14px, rgba(155,42,26,.05) 14px 18px),
    rgba(155,42,26,.06);
  position: relative;
  text-align: center;
}
.cmd-mark {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--char-coal);
  color: var(--rust-bright);
  font-family: var(--f-display-cn);
  font-size: 22px;
  padding: 0 14px;
  letter-spacing: 0;
}
.cmd-label {
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: .5em;
  color: var(--rust);
  text-transform: uppercase;
  margin-bottom: 12px;
}
.cmd-text {
  font-family: var(--f-display-cn);
  font-size: 22px;
  letter-spacing: .08em;
  line-height: 1.6;
  color: var(--kraft-cream);
}

/* actions — P0 archive dominates, rest demoted */
.actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
  padding-top: 10px;
}
.btn-archive {
  width: 100%;
  padding: 17px;
  border: 2px solid var(--rust);
  background: rgba(155,42,26,.2);
  color: var(--kraft-cream);
  box-shadow: 0 4px 0 rgba(0,0,0,.32);
  position: relative;
  transition: transform .2s var(--ease-paper), background .2s ease, box-shadow .2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}
.btn-archive::before, .btn-archive::after {
  content: "";
  position: absolute;
  width: 13px; height: 13px;
  border: 2px solid var(--rust);
}
.btn-archive::before { top: -3px; left: -3px; border-right: none; border-bottom: none; }
.btn-archive::after  { bottom: -3px; right: -3px; border-left: none; border-top: none; }
.btn-archive:active { transform: translateY(2px); box-shadow: 0 2px 0 rgba(0,0,0,.32); background: rgba(155,42,26,.3); }
.btn-archive .cn {
  font-family: var(--f-display-cn);
  font-size: 19px;
  letter-spacing: .3em;
}
.btn-archive .en {
  font-family: var(--f-display-en);
  font-size: 9px;
  letter-spacing: .42em;
  color: var(--rust);
  text-transform: uppercase;
}

.actions-sub {
  display: flex;
  gap: 10px;
}
.btn-sub {
  flex: 1;
  padding: 11px 8px;
  border: 1px solid var(--kraft-shadow);
  background: transparent;
  color: var(--kraft-light);
  font-family: var(--f-display-cn);
  font-size: 14px;
  letter-spacing: .18em;
  transition: transform .2s var(--ease-paper), background .2s ease;
  text-align: center;
}
.btn-sub:active { transform: translateY(1px); background: rgba(212,184,134,.08); }
.btn-sub:disabled { opacity: .5; }

/* offscreen capture target */
.capture-host {
  position: fixed;
  left: -10000px;
  top: 0;
  pointer-events: none;
  z-index: -1;
}

/* share preview modal */
.share-modal {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(10,7,4,.85);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 32px 24px;
}
.share-preview {
  max-width: 100%;
  max-height: 64vh;
  box-shadow: 0 18px 50px rgba(0,0,0,.6);
  border: 1px solid var(--kraft-shadow);
}
.share-actions {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 360px;
}
.share-hint {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: .26em;
  color: var(--kraft-shadow);
  text-transform: uppercase;
}
.overlay-enter-active, .overlay-leave-active { transition: opacity .3s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }

/* small screens */
@media (max-width: 380px) {
  .title .cn { font-size: 26px; letter-spacing: .2em; }
  .cmd-text { font-size: 19px; }
  .entry .body { font-size: 15px; }
  .chip-name { font-size: 12px; }
}
</style>
