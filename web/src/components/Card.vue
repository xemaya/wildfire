<template>
  <article class="wf-card" :class="{ locked, compact }">
    <div class="head-row">
      <!-- vertical name strip -->
      <div class="name-strip">
        <span class="corner tl"></span><span class="corner tr"></span>
        <span class="corner bl"></span><span class="corner br"></span>
        <span class="name">{{ locked ? '？' : card.title }}</span>
        <span class="vol-box"><span>{{ locked ? '？' : card.vol }}</span></span>
      </div>

      <!-- image plate -->
      <figure class="plate">
        <img v-if="img && !locked" :src="img" :alt="card.title" loading="lazy">
        <div v-else class="placeholder" :class="{ 'is-locked': locked }">
          <span class="ph-glyph">{{ locked ? '？' : sys.sym }}</span>
          <span class="ph-note" v-if="!locked">未 制 图</span>
        </div>
      </figure>
    </div>

    <template v-if="!compact">
      <div class="meta-strip">
        <span class="chip">
          <span class="sym">{{ locked ? '？' : sys.sym }}</span>
          <template v-if="locked">UNIDENTIFIED · 未 解 锁</template>
          <template v-else>{{ sys.en }} · {{ sys.cn }}</template>
        </span>
      </div>

      <p class="desc">{{ locked ? '？ ？ ？' : card.desc }}</p>

      <div class="action" v-if="!locked">
        <span class="arrow">→</span>
        <span class="label">行动倾向</span>
        <span class="value">{{ card.action }}</span>
      </div>
    </template>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { SYSTEMS } from '../data/cards.js'
import { illustrationFor } from '../data/illustrations.js'

const props = defineProps({
  card: { type: Object, required: true },
  locked: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
})

const sys = computed(() => SYSTEMS[props.card.system] || { cn: '', en: '', sym: '？' })
const img = computed(() => illustrationFor(props.card.id))
</script>

<style scoped>
/* sizes scale with card width via container query units (cqw) */
.wf-card {
  container-type: inline-size;
  width: 100%;
  background: var(--kraft);
  color: var(--ink-hand);
  padding: 5cqw;
  position: relative;
  font-family: var(--f-body-cn);
  background-image:
    radial-gradient(ellipse 90% 60% at 50% 0%, rgba(232,214,173,.55), transparent 60%),
    radial-gradient(ellipse at 100% 100%, rgba(93,74,44,.42), transparent 65%),
    var(--noise-kraft);
  background-blend-mode: multiply, multiply, multiply;
  box-shadow:
    inset 0 1px 0 rgba(255,232,180,.5),
    0 1px 0 rgba(0,0,0,.2),
    0 8px 18px -6px rgba(0,0,0,.5);
  clip-path: polygon(
    0.8% 0.5%, 14% 0%, 38% 0.5%, 62% 0%, 86% 0.5%, 99% 0%,
    100% 14%, 99.6% 38%, 100% 62%, 99.7% 86%, 100% 99.5%,
    82% 100%, 58% 99.5%, 36% 100%, 14% 99.5%, 0% 100%,
    0.4% 78%, 0% 54%, 0.4% 30%, 0% 8%
  );
}
.wf-card::before {
  content: "";
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  pointer-events: none;
  background: linear-gradient(90deg,
    transparent 0%, rgba(232,214,173,.5) 26%, transparent 46%,
    rgba(232,214,173,.4) 66%, transparent 100%);
}
.wf-card.locked {
  background: var(--kraft-darker);
  background-image:
    repeating-linear-gradient(45deg, transparent 0 6px, rgba(20,17,13,.12) 6px 8px),
    var(--noise-kraft);
  background-blend-mode: multiply, multiply;
}

/* ---------- head row ---------- */
.head-row {
  display: flex;
  gap: 2.5cqw;
  align-items: stretch;
}

/* name strip */
.name-strip {
  flex: 0 0 12cqw;
  position: relative;
  background: linear-gradient(180deg, var(--kraft-deep), var(--kraft-darker));
  border: 1px solid var(--ink-black);
  padding: 3cqw 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-shadow:
    inset 0 0 0 1px rgba(232,214,173,.22),
    inset 0 6cqw 10cqw -8cqw rgba(0,0,0,.3);
}
.name-strip::after {
  content: "";
  position: absolute; inset: 0;
  pointer-events: none;
  background: var(--noise-kraft);
  mix-blend-mode: multiply;
  opacity: .5;
}
.corner {
  position: absolute;
  width: 2cqw; height: 2cqw;
  border: 1px solid var(--ink-black);
  z-index: 2;
}
.corner.tl { top: 1.2cqw; left: 1.2cqw; border-right: none; border-bottom: none; }
.corner.tr { top: 1.2cqw; right: 1.2cqw; border-left: none; border-bottom: none; }
.corner.bl { bottom: 1.2cqw; left: 1.2cqw; border-right: none; border-top: none; }
.corner.br { bottom: 1.2cqw; right: 1.2cqw; border-left: none; border-top: none; }

.name {
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-family: var(--f-display-cn);
  font-size: 8cqw;
  letter-spacing: .16em;
  color: var(--ink-black);
  line-height: 1;
  z-index: 1;
}
.vol-box {
  border: 1px solid var(--ink-black);
  padding: 1.2cqw 0;
  width: 5.5cqw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(232,214,173,.18);
  z-index: 1;
}
.vol-box span {
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-family: var(--f-display-cn);
  font-size: 3cqw;
  color: var(--ink-black);
  letter-spacing: .06em;
  line-height: 1;
}

/* image plate */
.plate {
  flex: 1;
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
  background: var(--char-coal);
  transform: rotate(.3deg);
  box-shadow:
    0 1px 0 rgba(140,117,73,.4),
    0 4px 10px -4px rgba(20,12,6,.4);
}
.plate img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: 50% 50%;
}
.placeholder {
  width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2cqw;
  background:
    radial-gradient(ellipse at 40% 30%, rgba(232,214,173,.3), transparent 60%),
    var(--noise-kraft),
    var(--kraft-deep);
  background-blend-mode: multiply, multiply, normal;
}
.placeholder .ph-glyph {
  font-family: var(--f-display-cn);
  font-size: 18cqw;
  color: var(--kraft-shadow);
  opacity: .55;
  line-height: 1;
}
.placeholder .ph-note {
  font-family: var(--f-mono);
  font-size: 2.6cqw;
  letter-spacing: .3em;
  color: var(--kraft-shadow);
  opacity: .7;
}
.placeholder.is-locked {
  background:
    repeating-linear-gradient(45deg, transparent 0 8px, rgba(20,17,13,.18) 8px 10px),
    var(--char-coal);
}
.placeholder.is-locked .ph-glyph {
  color: var(--rust);
  opacity: .7;
}

/* ---------- meta strip ---------- */
.meta-strip {
  display: flex;
  align-items: center;
  margin-top: 3.5cqw;
  padding-bottom: 2.5cqw;
  border-bottom: 1px solid var(--ink-hand);
  font-family: var(--f-mono);
  font-size: 2.6cqw;
  letter-spacing: .26em;
  color: var(--rust);
  text-transform: uppercase;
}
.locked .meta-strip { color: var(--kraft-shadow); }
.meta-strip .chip { display: inline-flex; align-items: center; gap: 1.8cqw; }
.meta-strip .chip .sym {
  width: 4cqw; height: 4cqw;
  border: 1px solid currentColor;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--f-display-cn);
  font-size: 2.6cqw;
  letter-spacing: 0;
}

/* ---------- desc ---------- */
.desc {
  font-family: var(--f-body-cn);
  font-size: 3.9cqw;
  line-height: 1.8;
  color: var(--ink-hand);
  margin-top: 3cqw;
}
.locked .desc {
  color: var(--kraft-shadow);
  letter-spacing: .3em;
}

/* ---------- action ---------- */
.action {
  display: flex;
  align-items: center;
  gap: 2.5cqw;
  margin-top: 3.5cqw;
  padding-top: 3cqw;
  border-top: 1px dashed var(--kraft-edge);
}
.action .arrow {
  color: var(--rust);
  font-family: var(--f-body-en);
  font-size: 4.5cqw;
  line-height: 1;
}
.action .label {
  font-family: var(--f-mono);
  font-size: 2.6cqw;
  letter-spacing: .26em;
  color: var(--rust);
  text-transform: uppercase;
}
.action .value {
  font-family: var(--f-display-cn);
  font-size: 4.6cqw;
  color: var(--ink-black);
  letter-spacing: .1em;
  line-height: 1;
  margin-left: auto;
}

/* ---------- compact (thumbnail) ---------- */
.wf-card.compact { padding: 4cqw; }
.wf-card.compact .name { font-size: 11cqw; }
.wf-card.compact .name-strip { flex-basis: 16cqw; }
.wf-card.compact .vol-box { width: 7cqw; }
.wf-card.compact .vol-box span { font-size: 4cqw; }
.wf-card.compact .placeholder .ph-glyph { font-size: 22cqw; }
</style>
