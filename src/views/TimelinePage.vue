<template>
  <section
    id="timeline"
    ref="timelineSection"
    class="timeline-page"
    aria-labelledby="timeline-title"
  >
    <header class="timeline-intro">
      <p>EXPERIENCE / 2020 — NOW</p>
      <h2 id="timeline-title">从工程验证，走到产品判断。</h2>
      <p class="timeline-intro__copy">
        七段经历不是工具清单，而是我不断把问题、系统边界与验证方式说得更清楚的过程。
      </p>
    </header>

    <div class="timeline-layout">
      <TimelineRail
        :years="timelineYears"
        :active-year="activeItem.year"
        :progress="scrollProgress"
      />

      <div class="timeline-entries">
        <div
          v-for="item in timelineItems"
          :key="item.id"
          :ref="(element) => setEntryElement(element, item.id)"
          class="timeline-entry-shell"
          :data-timeline-id="item.id"
        >
          <TimelineEntry
            :item="item"
            :active="item.id === activeId"
            :revealed="revealedIds.has(item.id)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import TimelineEntry from '../components/timeline/TimelineEntry.vue'
import TimelineRail from '../components/timeline/TimelineRail.vue'
import { timelineItems } from '../data/portfolio.js'

const timelineSection = ref(null)
const activeId = ref(timelineItems[0].id)
const revealedIds = ref(new Set())
const scrollProgress = ref(0)
const entryElements = new Map()
const visibleEntries = new Map()

let entryObserver = null
let scrollFrame = null
let motionQuery = null

const activeItem = computed(() => (
  timelineItems.find((item) => item.id === activeId.value) || timelineItems[0]
))

const timelineYears = computed(() => {
  const firstIndexByYear = new Map()

  timelineItems.forEach((item, index) => {
    if (!firstIndexByYear.has(item.year)) firstIndexByYear.set(item.year, index)
  })

  return Array.from(firstIndexByYear, ([label, index]) => ({
    label,
    position: timelineItems.length > 1 ? (index / (timelineItems.length - 1)) * 100 : 0,
  }))
})

function setEntryElement(element, id) {
  if (element) {
    entryElements.set(id, element)
  } else {
    entryElements.delete(id)
  }
}

function reveal(id) {
  if (revealedIds.value.has(id)) return
  revealedIds.value = new Set([...revealedIds.value, id])
}

function revealAll() {
  revealedIds.value = new Set(timelineItems.map((item) => item.id))
}

function updateActiveEntry() {
  if (!visibleEntries.size) return

  const focusY = window.innerHeight * 0.4
  let closestId = activeId.value
  let closestDistance = Number.POSITIVE_INFINITY

  visibleEntries.forEach((entry, id) => {
    const rect = entry.target.getBoundingClientRect()
    const distance = Math.abs(rect.top + rect.height / 2 - focusY)

    if (distance < closestDistance) {
      closestDistance = distance
      closestId = id
    }
  })

  activeId.value = closestId
}

function observeEntries() {
  if (!('IntersectionObserver' in window)) {
    revealAll()
    return
  }

  entryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.dataset.timelineId
      if (!id) return

      if (entry.isIntersecting) {
        visibleEntries.set(id, entry)
        reveal(id)
      } else {
        visibleEntries.delete(id)
      }
    })

    updateActiveEntry()
  }, {
    root: null,
    rootMargin: '-18% 0px -42% 0px',
    threshold: [0, 0.2, 0.5, 0.8],
  })

  entryElements.forEach((element) => entryObserver.observe(element))
}

function updateScrollProgress() {
  scrollFrame = null
  const section = timelineSection.value
  if (!section) return

  const rect = section.getBoundingClientRect()
  const scrollRange = Math.max(section.offsetHeight - window.innerHeight, 1)
  scrollProgress.value = Math.min(Math.max(-rect.top / scrollRange, 0), 1)
}

function requestScrollUpdate() {
  if (scrollFrame !== null) return
  scrollFrame = window.requestAnimationFrame(updateScrollProgress)
}

function onMotionPreferenceChange(event) {
  if (event.matches) revealAll()
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (motionQuery.matches) revealAll()
  motionQuery.addEventListener?.('change', onMotionPreferenceChange)

  observeEntries()
  updateScrollProgress()
  window.addEventListener('scroll', requestScrollUpdate, { passive: true })
  window.addEventListener('resize', requestScrollUpdate)
})

onBeforeUnmount(() => {
  entryObserver?.disconnect()
  visibleEntries.clear()
  window.removeEventListener('scroll', requestScrollUpdate)
  window.removeEventListener('resize', requestScrollUpdate)
  motionQuery?.removeEventListener?.('change', onMotionPreferenceChange)

  if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame)
})
</script>

<style scoped>
.timeline-page {
  position: relative;
  min-height: 100svh;
  overflow: clip;
  padding: 0 clamp(24px, 6vw, 96px) clamp(80px, 12vh, 140px);
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.16), transparent 32%),
    var(--bg);
  color: var(--ink);
}

.timeline-intro {
  display: grid;
  min-height: 68svh;
  max-width: 1180px;
  align-content: center;
  margin: 0 auto;
  border-bottom: 1px solid var(--line-strong);
  padding: clamp(80px, 14vh, 150px) 0;
}

.timeline-intro > p:first-child {
  margin: 0 0 24px;
  color: var(--muted);
  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.timeline-intro h2 {
  max-width: 12ch;
  font-size: clamp(54px, 8vw, 112px);
  line-height: 0.96;
}

.timeline-intro__copy {
  max-width: 46ch;
  margin: 38px 0 0;
  color: var(--muted);
  font-size: clamp(15px, 1.25vw, 18px);
  line-height: 1.75;
}

.timeline-layout {
  display: grid;
  max-width: 1180px;
  grid-template-columns: minmax(210px, 0.56fr) minmax(0, 1.44fr);
  gap: clamp(52px, 9vw, 150px);
  margin: 0 auto;
  padding-top: clamp(72px, 12vh, 132px);
}

.timeline-entries,
.timeline-entry-shell {
  min-width: 0;
}

@media (max-width: 900px) {
  .timeline-layout {
    grid-template-columns: minmax(170px, 0.42fr) minmax(0, 1fr);
    gap: 48px;
  }
}

@media (max-width: 760px) {
  .timeline-page {
    overflow: visible;
    padding-right: 20px;
    padding-bottom: 80px;
    padding-left: 20px;
  }

  .timeline-intro {
    min-height: 78svh;
    padding: 82px 0 70px;
  }

  .timeline-intro h2 {
    max-width: 9ch;
    font-size: clamp(48px, 14vw, 66px);
  }

  .timeline-intro__copy {
    margin-top: 30px;
    font-size: 16px;
  }

  .timeline-layout {
    grid-template-columns: 16px minmax(0, 1fr);
    gap: 20px;
    padding-top: 64px;
  }
}
</style>
