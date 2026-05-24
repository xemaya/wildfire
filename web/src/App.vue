<template>
  <div class="app-frame">
    <TopBar v-if="showTop" />
    <div class="view-host">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
    <BottomNav v-if="chrome" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopBar from './components/TopBar.vue'
import BottomNav from './components/BottomNav.vue'

const route = useRoute()
// bottom nav on the main tabs; draw/briefing are immersive.
const chrome = computed(() => ['home', 'archive', 'timeline'].includes(route.name))
// top bar everywhere chrome shows EXCEPT home (home has its own big 星火 brand).
const showTop = computed(() => ['archive', 'timeline'].includes(route.name))
</script>

<style>
.app-frame {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.view-host {
  flex: 1;
  min-height: 0;
  position: relative;
}
.view-host > * { height: 100%; }

/* page settle: old page lifts away, new page rises onto the desk */
.page-enter-active { transition: opacity .38s var(--ease-paper), transform .38s var(--ease-paper); }
.page-leave-active { transition: opacity .22s ease, transform .22s ease; }
.page-enter-from { opacity: 0; transform: translateY(14px) scale(.992); }
.page-leave-to { opacity: 0; transform: translateY(-8px) scale(.992); }
</style>
