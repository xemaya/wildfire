<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style>
/* page settle: old page lifts away, new page rises onto the desk */
.page-enter-active {
  transition: opacity .38s var(--ease-paper), transform .38s var(--ease-paper);
}
.page-leave-active {
  transition: opacity .22s ease, transform .22s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(14px) scale(.992);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(.992);
}
</style>
