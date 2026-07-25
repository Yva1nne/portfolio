<template>
  <main>
    <!-- Transition page: cover + portfolio with ticket-tear animation -->
    <TransitionPage
      ref="transitionRef"
      :class="{ 'snap-section': true }"
      @transition-complete="onTransitionComplete"
    />

    <!-- Only show projects after cover→portfolio transition is done -->
    <ZaiSection v-if="showProjects" class="snap-section" />
  </main>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import TransitionPage from './views/TransitionPage.vue'

const ZaiSection = defineAsyncComponent(() => import('./views/ZaiPage.vue'))

const showProjects = ref(false)

function onTransitionComplete() {
  // Transition done — portfolio page is now fully visible, enable scroll to projects
  showProjects.value = true
}
</script>

<style>
main {
  scroll-snap-type: y proximity;
  scroll-behavior: smooth;
  overflow-y: auto;
  height: 100svh;
  overscroll-behavior-y: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
  background: var(--bg);
}

main::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.snap-section {
  position: relative;
  min-height: 100svh;
  scroll-snap-align: start;
  scroll-snap-stop: normal;
}
</style>
