<template>
  <main>
    <CustomCursor />
    <TransitionPage
      ref="transitionRef"
      @transition-complete="onTransitionComplete"
    />

    <GlobalNav v-if="showProjects" />
    <MusicPlayer v-if="showProjects" />
    <TimelinePage v-if="showProjects" />
    <div
      v-if="showProjects"
      id="work"
      ref="workAnchor"
      class="work-anchor"
    >
      <ZaiSection v-if="showWork" />
    </div>
  </main>
</template>

<script setup>
import { defineAsyncComponent, nextTick, onBeforeUnmount, ref } from 'vue'
import CustomCursor from './components/CustomCursor.vue'
import GlobalNav from './components/GlobalNav.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import TransitionPage from './views/TransitionPage.vue'

const ZaiSection = defineAsyncComponent(() => import('./views/ZaiPage.vue'))
const TimelinePage = defineAsyncComponent(() => import('./views/TimelinePage.vue'))

const showProjects = ref(false)
const showWork = ref(false)
const workAnchor = ref(null)
let workObserver = null

async function onTransitionComplete() {
  showProjects.value = true
  await nextTick()

  if (typeof IntersectionObserver === 'undefined') {
    showWork.value = true
    return
  }

  workObserver = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return
    showWork.value = true
    workObserver?.disconnect()
    workObserver = null
  }, { rootMargin: '600px 0px' })

  if (workAnchor.value) workObserver.observe(workAnchor.value)
}

onBeforeUnmount(() => workObserver?.disconnect())
</script>

<style>
main {
  min-height: 100svh;
  background: var(--bg);
}

.work-anchor {
  min-height: 100svh;
}
</style>
