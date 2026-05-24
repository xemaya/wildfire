<template>
  <header class="top-bar">
    <div class="brand">
      <span class="mark">星火</span>
    </div>
    <div class="cmd">
      <span class="cmd-name">指 挥 部</span>
      <span class="cmd-sub">遇事不决 · 抽卡毛选</span>
    </div>
    <button class="mute" @click="onMute" :aria-label="muted ? '取消静音' : '静音'">
      {{ muted ? '🔇' : '🔊' }}
    </button>
  </header>
</template>

<script setup>
import { muted, toggleMute, sfx } from '../utils/sfx.js'
function onMute () { toggleMute(); if (!muted.value) sfx.switch() }
</script>

<style scoped>
.top-bar {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: calc(8px + env(safe-area-inset-top)) 16px 8px;
  border-bottom: 1px solid var(--kraft-edge);
  background:
    linear-gradient(180deg, rgba(28,22,15,.95), rgba(20,15,10,.9)),
    var(--noise-char);
  background-blend-mode: multiply;
}
.brand { display: flex; flex-direction: column; line-height: 1; }
.brand .mark {
  font-family: var(--f-display-cn); font-size: 20px; letter-spacing: .12em;
  color: var(--kraft-cream); text-shadow: 0 1px 0 rgba(0,0,0,.5);
}
.brand .en {
  font-family: var(--f-display-en); font-size: 8px; letter-spacing: .34em;
  color: var(--rust-bright); text-transform: uppercase; margin-top: 2px;
}
.cmd {
  margin-left: 6px; padding-left: 12px;
  border-left: 1px solid var(--kraft-edge);
  display: flex; flex-direction: column; line-height: 1.3;
}
.cmd-name { font-family: var(--f-display-cn); font-size: 13px; letter-spacing: .18em; color: var(--kraft-light); }
.cmd-sub { font-family: var(--f-mono); font-size: 8px; letter-spacing: .12em; color: var(--kraft-shadow); }
.mute {
  margin-left: auto;
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px;
  border: 1px solid var(--kraft-edge);
  border-radius: 2px;
  opacity: .8;
}
.mute:active { opacity: 1; }
</style>
