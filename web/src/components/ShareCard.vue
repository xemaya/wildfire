<template>
  <div class="share-card">
    <!-- decorative punch holes -->
    <div class="sc-holes"><b></b><b></b><b></b><b></b><b></b></div>

    <header class="sc-head">
      <div class="sc-brand">星火</div>
      <div class="sc-date">{{ date }}</div>
    </header>

    <div class="sc-classify">— 战 略 简 报 —</div>

    <!-- 3 cards -->
    <div class="sc-cards">
      <div v-for="c in cards" :key="c.id" class="sc-chip">
        <span class="sc-sym">{{ sym(c) }}</span>
        <span class="sc-name">{{ c.title }}</span>
      </div>
    </div>

    <!-- 3 fields -->
    <section class="sc-field">
      <div class="sc-label">当前局势</div>
      <p class="sc-text">{{ briefing.situation }}</p>
    </section>
    <section class="sc-field">
      <div class="sc-label">当前风险</div>
      <p class="sc-text">{{ briefing.risk }}</p>
    </section>
    <section class="sc-field">
      <div class="sc-label">当前建议</div>
      <p class="sc-text">{{ briefing.advice }}</p>
    </section>

    <!-- command -->
    <section class="sc-command">
      <div class="sc-cmd-label">— 今 日 军 令 —</div>
      <p class="sc-cmd-text">{{ briefing.command }}</p>
    </section>

    <footer class="sc-foot">
      <div class="sc-slogan">遇事不决 · 抽卡毛选</div>
      <div class="sc-seal">★</div>
    </footer>
  </div>
</template>

<script setup>
import { SYSTEMS } from '../data/cards.js'

defineProps({
  cards: { type: Array, required: true },
  briefing: { type: Object, required: true },
  date: { type: String, required: true },
})

function sym (c) {
  return SYSTEMS[c.system]?.sym || '？'
}
</script>

<style scoped>
.share-card {
  width: 480px;
  padding: 40px 40px 32px;
  background-color: #dabf8e;
  color: #2e2418;
  font-family: var(--f-body-cn);
  position: relative;
  /* clean gradients only — SVG noise renders too dark in capture */
  background-image:
    radial-gradient(ellipse 90% 50% at 50% 0%, rgba(243,228,188,.55), transparent 55%),
    radial-gradient(ellipse at 100% 100%, rgba(150,124,80,.22), transparent 55%),
    radial-gradient(ellipse at 0% 100%, rgba(150,124,80,.14), transparent 50%);
  box-shadow: 0 20px 60px rgba(0,0,0,.5);
  overflow: hidden;
}

.sc-holes {
  position: absolute;
  left: 14px; top: 0; bottom: 0;
  width: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.sc-holes b {
  width: 12px; height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #0c0a07 60%, #2a2014 100%);
}

.sc-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-left: 18px;
}
.sc-brand {
  font-family: var(--f-display-cn);
  font-size: 44px;
  letter-spacing: .1em;
  color: #14110d;
  line-height: 1;
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.sc-brand .en {
  font-family: var(--f-display-en);
  font-size: 13px;
  letter-spacing: .4em;
  color: #9b2a1a;
}
.sc-date {
  font-family: var(--f-mono);
  font-size: 12px;
  letter-spacing: .22em;
  color: #5d4a2c;
}

.sc-classify {
  margin: 6px 0 22px 18px;
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: .3em;
  color: #9b2a1a;
  text-transform: uppercase;
  border-top: 1px solid #2e2418;
  border-bottom: 1px solid #2e2418;
  padding: 6px 0;
  text-align: center;
}

.sc-cards {
  display: flex;
  gap: 8px;
  margin: 0 0 22px 18px;
}
.sc-chip {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 8px;
  background: rgba(20,17,13,.06);
  border: 1px solid #5d4a2c;
  border-left: 3px solid #9b2a1a;
}
.sc-sym {
  width: 20px; height: 20px;
  border: 1px solid #9b2a1a;
  color: #9b2a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--f-display-cn);
  font-size: 12px;
  flex-shrink: 0;
}
.sc-name {
  font-family: var(--f-display-cn);
  font-size: 15px;
  letter-spacing: .04em;
  color: #14110d;
  line-height: 1;
}

.sc-field {
  margin: 0 0 16px 18px;
  padding-bottom: 14px;
  border-bottom: 1px dashed #5d4a2c;
}
.sc-label {
  font-family: var(--f-display-cn);
  font-size: 14px;
  letter-spacing: .18em;
  color: #9b2a1a;
  margin-bottom: 6px;
}
.sc-text {
  font-family: var(--f-body-cn);
  font-size: 16px;
  line-height: 1.8;
  color: #2e2418;
}

.sc-command {
  margin: 18px 0 18px 18px;
  padding: 22px 16px 18px;
  border: 2px solid #9b2a1a;
  background: rgba(155,42,26,.06);
  text-align: center;
  position: relative;
}
.sc-cmd-label {
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: .42em;
  color: #9b2a1a;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.sc-cmd-text {
  font-family: var(--f-display-cn);
  font-size: 24px;
  letter-spacing: .08em;
  line-height: 1.5;
  color: #14110d;
}

.sc-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 18px;
  padding-top: 8px;
}
.sc-slogan {
  font-family: var(--f-brush, var(--f-display-cn));
  font-size: 20px;
  color: #5e1a10;
}
.sc-seal {
  width: 44px; height: 44px;
  border: 2px solid #9b2a1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9b2a1a;
  font-size: 20px;
  transform: rotate(-8deg);
}
</style>
