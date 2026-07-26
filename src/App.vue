<template>
  <main>
    <TransitionPage
      ref="transitionRef"
      @transition-complete="onTransitionComplete"
    />

    <GlobalNav v-if="showProjects" />
    <TimelinePage v-if="showProjects" />
    <ZaiSection v-if="showProjects" />
  </main>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import GlobalNav from './components/GlobalNav.vue'
import TransitionPage from './views/TransitionPage.vue'

const ZaiSection = defineAsyncComponent(() => import('./views/ZaiPage.vue'))
const TimelinePage = defineAsyncComponent(() => import('./views/TimelinePage.vue'))

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
