<template>
  <Transition name="overlay">
    <div v-if="card" class="overlay" @click.self="$emit('close')">
      <div class="overlay-card">
        <Card :card="card" />
        <button class="overlay-close" @click="$emit('close')">关 闭 ✕</button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import Card from './Card.vue'

defineProps({
  card: { type: Object, default: null },
})
defineEmits(['close'])
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(10,7,4,.82);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 28px;
}
.overlay-card {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.overlay-close {
  align-self: center;
  font-family: var(--f-display-cn);
  font-size: 14px;
  letter-spacing: .28em;
  color: var(--kraft-cream);
  border: 1px solid var(--kraft-shadow);
  padding: 10px 28px;
  background: rgba(212,184,134,.06);
}
.overlay-close:active { background: rgba(212,184,134,.16); }

.overlay-enter-active, .overlay-leave-active { transition: opacity .3s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }
.overlay-enter-active .overlay-card { transition: transform .35s var(--ease-paper); }
.overlay-enter-from .overlay-card { transform: scale(.92) translateY(12px); }
</style>
