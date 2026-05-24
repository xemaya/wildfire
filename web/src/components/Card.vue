<template>
  <article
    class="wf-card"
    :class="{ locked, compact }"
  >
    <!-- rust inner frame -->
    <span class="frame" aria-hidden="true"></span>

    <!-- category seal -->
    <span class="seal">{{ locked ? '？' : sys.cn }}</span>

    <!-- illustration plate -->
    <figure class="plate">
      <img v-if="img && !locked" :src="img" :alt="card.title" loading="lazy">
      <div v-else class="ph"><span>{{ locked ? '？' : sys.sym }}</span></div>
      <span class="plate-edge" aria-hidden="true"></span>
    </figure>

    <!-- quote = body -->
    <blockquote class="quote">
      <span class="text">{{ locked ? '？　？　？' : card.quote }}</span>
    </blockquote>

    <!-- source + star -->
    <footer class="foot" v-if="!compact">
      <span class="src">{{ locked ? '《 ？ ？ 》' : '—《' + card.src + '》' }}</span>
      <span class="star" aria-hidden="true">★</span>
    </footer>
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
.wf-card {
  container-type: inline-size;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 4.5cqw 4.5cqw 4cqw;
  background: var(--kraft);
  color: var(--ink-hand);
  font-family: var(--f-body-cn);
  background-image:
    radial-gradient(ellipse 95% 55% at 50% 0%, rgba(236,220,175,.6), transparent 62%),
    radial-gradient(ellipse at 102% 104%, rgba(93,74,44,.5), transparent 60%),
    var(--noise-kraft);
  background-blend-mode: multiply, multiply, multiply;
  box-shadow:
    inset 0 1px 0 rgba(255,236,188,.55),
    0 2px 0 rgba(0,0,0,.25),
    0 14px 26px -10px rgba(0,0,0,.6);
  overflow: hidden;
}
/* rust double frame */
.frame {
  position: absolute;
  inset: 2.4cqw;
  border: 1px solid var(--rust);
  box-shadow: inset 0 0 0 1.6cqw var(--kraft), inset 0 0 0 1.8cqw rgba(155,42,26,.55);
  pointer-events: none;
  mix-blend-mode: multiply;
  opacity: .85;
}
.wf-card.locked {
  background: var(--kraft-darker);
  background-image:
    repeating-linear-gradient(45deg, transparent 0 6px, rgba(20,17,13,.13) 6px 8px),
    var(--noise-kraft);
  background-blend-mode: multiply, multiply;
}
.locked .frame { border-color: var(--kraft-shadow); box-shadow: inset 0 0 0 1.6cqw var(--kraft-darker); }

/* category seal — top-left, stamped */
.seal {
  position: absolute;
  top: 4.4cqw; left: 4.4cqw;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 11cqw;
  padding: 1.6cqw 2.2cqw;
  background: var(--rust);
  color: var(--kraft-cream);
  font-family: var(--f-display-cn);
  font-size: 4.6cqw;
  letter-spacing: .14em;
  line-height: 1;
  box-shadow: 0 1px 0 rgba(0,0,0,.3), inset 0 0 0 1px rgba(236,220,175,.25);
  transform: rotate(-1.5deg);
}
.locked .seal { background: var(--kraft-shadow); }

/* illustration plate */
.plate {
  position: relative;
  width: 100%;
  height: 42%;
  flex: 0 0 auto;
  margin-top: 1cqw;
  overflow: hidden;
  background: var(--char-coal);
}
.plate img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 40%; display: block; filter: saturate(.92) contrast(1.04); }
.plate .ph {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: radial-gradient(ellipse at 40% 30%, rgba(232,214,173,.3), transparent 60%), var(--kraft-deep);
}
.plate .ph span { font-family: var(--f-display-cn); font-size: 24cqw; color: var(--kraft-shadow); opacity: .5; }
.plate-edge { position: absolute; inset: 0; pointer-events: none; box-shadow: inset 0 0 0 1px rgba(20,12,6,.55), inset 0 -6cqw 10cqw -8cqw rgba(0,0,0,.5); }
.locked .plate { filter: grayscale(.4) brightness(.7); }

/* quote */
.quote {
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 3.5cqw 1cqw 1cqw;
}
.quote .text {
  font-family: var(--f-display-cn);
  font-size: 6.2cqw;          /* 统一字号，不再随长短变化 */
  line-height: 1.66;
  letter-spacing: .03em;
  color: var(--ink-black);
  text-shadow: 0 1px 0 rgba(255,240,200,.4);
}
.locked .quote .text { color: var(--kraft-shadow); letter-spacing: .3em; }

/* footer */
.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2cqw;
  padding-top: 2.4cqw;
  border-top: 1px solid var(--kraft-edge);
}
.foot .src { font-family: var(--f-body-cn); font-size: 3.1cqw; letter-spacing: .06em; color: var(--rust); }
.foot .star { font-family: var(--f-display-en); font-size: 4.4cqw; color: var(--rust); opacity: .9; line-height: 1; }
.locked .foot .src, .locked .foot .star { color: var(--kraft-shadow); }

/* ---------- compact (archive thumbnail) ---------- */
.wf-card.compact { padding: 3.5cqw; }
.wf-card.compact .frame { inset: 2cqw; }
.wf-card.compact .seal { font-size: 3.6cqw; padding: 1.2cqw 1.8cqw; top: 3.4cqw; left: 3.4cqw; }
.wf-card.compact .plate { height: 52%; }
.wf-card.compact .quote { padding: 3cqw .5cqw 0; }
.wf-card.compact .quote .text {
  font-size: 4.4cqw; line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
</style>
