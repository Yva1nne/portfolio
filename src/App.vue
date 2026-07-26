<template>
  <main>
    <TransitionPage
      ref="transitionRef"
      @transition-complete="onTransitionComplete"
    />

    <ZaiSection v-if="showProjects" />
  </main>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import TransitionPage from './views/TransitionPage.vue'

const ZaiSection = defineAsyncComponent(() => import('./views/ZaiPage.vue'))

const showProjects = ref(false)

function onTransitionComplete() {
  showProjects.value = true
}
</script>

<style>
main {
  min-height: 100svh;
  background: var(--bg);
}
</style>
