<template>
  <section
    id="timeline"
    class="timeline-page"
    aria-labelledby="timeline-title"
  >
    <header class="timeline-intro">
      <p>EXPERIENCE / 2020 — NOW</p>
      <h2 id="timeline-title">从工程实践，走到产品判断。</h2>
      <p class="timeline-intro__copy">
        七段经历记录了我从工程实践、AI 项目到产品工作的路径，也呈现了问题拆解与系统边界逐步清晰的过程。
      </p>
    </header>

    <div class="timeline-layout">
      <section
        v-for="lane in timelineLanes"
        :key="lane.id"
        class="timeline-lane"
        :class="`timeline-lane--${lane.id}`"
        :aria-labelledby="`timeline-lane-${lane.id}`"
      >
        <header class="timeline-lane__header">
          <span>{{ lane.number }}</span>
          <div>
            <p>{{ lane.kicker }}</p>
            <h3 :id="`timeline-lane-${lane.id}`">{{ lane.title }}</h3>
          </div>
        </header>

        <div class="timeline-entries">
          <div
            v-for="item in lane.items"
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
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import TimelineEntry from '../components/timeline/TimelineEntry.vue'
import { timelineItems } from '../data/portfolio.js'

const activeId = ref(timelineItems[0].id)
const revealedIds = ref(new Set())
const entryElements = new Map()
const visibleEntries = new Map()

let entryObserver = null
let motionQuery = null

const timelineLanes = computed(() => [
  {
    id: 'education',
    number: '01',
    kicker: 'EDUCATION',
    title: '教育经历',
    items: timelineItems.filter((item) => item.category === 'education'),
  },
  {
    id: 'project',
    number: '02',
    kicker: 'PROJECT / COMPETITION / INTERNSHIP',
    title: '项目、比赛与实习',
    items: timelineItems.filter((item) => item.category === 'project'),
  },
])

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

function onMotionPreferenceChange(event) {
  if (event.matches) revealAll()
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (motionQuery.matches) revealAll()
  motionQuery.addEventListener?.('change', onMotionPreferenceChange)

  observeEntries()
})

onBeforeUnmount(() => {
  entryObserver?.disconnect()
  visibleEntries.clear()
  motionQuery?.removeEventListener?.('change', onMotionPreferenceChange)
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
  max-width: 14ch;
  font-size: clamp(48px, 5.65vw, 72px);
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
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  gap: clamp(34px, 5vw, 74px);
  margin: 0 auto;
  padding-top: clamp(72px, 12vh, 132px);
}

.timeline-lane {
  min-width: 0;
}

.timeline-lane__header {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  min-height: 88px;
  border-top: 2px solid var(--ink);
  padding: 16px 0 22px;
}

.timeline-lane__header > span,
.timeline-lane__header p {
  color: var(--muted);
  font-family: 'Manrope', 'Noto Sans SC', sans-serif;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.timeline-lane__header p {
  margin: 0 0 6px;
}

.timeline-lane__header h3 {
  font-size: clamp(24px, 2.45vw, 34px);
  line-height: 1.1;
}

.timeline-entries,
.timeline-entry-shell {
  min-width: 0;
}

@media (max-width: 900px) {
  .timeline-layout {
    grid-template-columns: 1fr;
    gap: 72px;
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
    grid-template-columns: 1fr;
    gap: 60px;
    padding-top: 64px;
  }
}
</style>
