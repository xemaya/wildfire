// 合成音效（无需素材）：纸张/翻面/切换/电报。WebAudio，首个手势后启用，可静音。
import { ref } from 'vue'

let ctx = null
export const muted = ref(localStorage.getItem('wf-muted') === '1')

function ac () {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)() } catch { return null }
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

/** Call inside a user gesture to unlock audio (iOS/Chrome autoplay policy). */
export function unlockAudio () { ac() }

export function toggleMute () {
  muted.value = !muted.value
  localStorage.setItem('wf-muted', muted.value ? '1' : '0')
  return muted.value
}

function noiseBurst ({ dur = 0.13, freq = 1800, q = 0.7, gain = 0.16, type = 'bandpass' } = {}) {
  const c = ac(); if (!c || muted.value) return
  const n = Math.floor(c.sampleRate * dur)
  const buf = c.createBuffer(1, n, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2) // decaying noise
  const src = c.createBufferSource(); src.buffer = buf
  const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q
  const g = c.createGain(); g.gain.value = gain
  src.connect(f); f.connect(g); g.connect(c.destination); src.start()
}

function blip ({ freq = 520, dur = 0.06, gain = 0.1, type = 'triangle' } = {}) {
  const c = ac(); if (!c || muted.value) return
  const o = c.createOscillator(); const g = c.createGain()
  o.type = type; o.frequency.value = freq
  g.gain.setValueAtTime(gain, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur)
  o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + dur)
}

export const sfx = {
  shuffle () { noiseBurst({ dur: 0.22, freq: 1100, q: 0.5, gain: 0.13 }) }, // 洗牌/发牌
  flip ()    { noiseBurst({ dur: 0.10, freq: 2700, q: 0.9, gain: 0.17 }) }, // 翻面纸响
  switch ()  { blip({ freq: 300, dur: 0.05, gain: 0.07, type: 'sine' }) },  // 切换轻点
  telegram () { blip({ freq: 760, dur: 0.035, gain: 0.06 }) },              // 电报滴
  stamp ()   { noiseBurst({ dur: 0.09, freq: 420, q: 0.6, gain: 0.2, type: 'lowpass' }) }, // 盖章
}
