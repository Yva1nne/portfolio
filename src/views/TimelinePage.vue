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

    <div class="timeline-layout" aria-label="按年份排列的教育与项目双栏时间轴">
      <header class="timeline-columns">
        <p class="timeline-axis-label">YEAR</p>
        <div
          v-for="lane in timelineLanes"
          :key="lane.id"
          class="timeline-lane__header"
        >
          <span>{{ lane.number }}</span>
          <div>
            <p>{{ lane.kicker }}</p>
            <h3 :id="`timeline-lane-${lane.id}`">{{ lane.title }}</h3>
          </div>
        </div>
      </header>

      <section
        v-for="group in timelineGroups"
        :key="group.year"
        class="timeline-year-row"
        :aria-labelledby="`timeline-year-${group.year}`"
      >
        <header class="timeline-year-marker">
          <time :id="`timeline-year-${group.year}`">{{ group.year }}</time>
          <span aria-hidden="true"></span>
        </header>

        <div
          v-for="lane in timelineLanes"
          :key="lane.id"
          class="timeline-year-lane"
          :class="`timeline-year-lane--${lane.id}`"
          :aria-labelledby="`timeline-lane-${lane.id}`"
        >
          <p v-if="group[lane.id].length" class="timeline-year-lane__label">
            {{ lane.title }}
          </p>
          <div
            v-for="item in group[lane.id]"
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
  },
  {
    id: 'project',
    number: '02',
    kicker: 'PROJECT / COMPETITION / INTERNSHIP',
    title: '项目、比赛与实习',
  },
])

const timelineGroups = computed(() => (
  [...new Set(timelineItems.map((item) => item.year))].map((year) => ({
    year,
    education: timelineItems.filter((item) => item.year === year && item.category === 'education'),
    project: timelineItems.filter((item) => item.year === year && item.category === 'project'),
  }))
))

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
  max-width: 1180px;
  align-content: start;
  margin: 0 auto;
  border-bottom: 1px solid var(--line-strong);
  padding: clamp(64px, 9vh, 96px) 0 clamp(52px, 7vh, 76px);
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
  max-width: none;
  font-size: clamp(46px, 5.65vw, 64px);
  line-height: 1.02;
  text-wrap: balance;
}

.timeline-intro__copy {
  max-width: 60ch;
  margin: 24px 0 0;
  color: var(--muted);
  font-size: clamp(15px, 1.25vw, 18px);
  line-height: 1.75;
}

.timeline-layout {
  max-width: 1180px;
  margin: 0 auto;
  padding-top: clamp(52px, 8vh, 88px);
}

.timeline-columns,
.timeline-year-row {
  display: grid;
  grid-template-columns: clamp(58px, 7vw, 76px) repeat(2, minmax(0, 1fr));
}

.timeline-columns {
  border-top: 2px solid var(--ink);
  border-bottom: 1px solid var(--line-strong);
}

.timeline-axis-label,
.timeline-lane__header {
  min-width: 0;
  min-height: 96px;
  margin: 0;
  padding: 18px clamp(14px, 2.4vw, 28px) 22px;
}

.timeline-axis-label {
  border-right: 1px solid var(--line-strong);
  color: var(--muted);
  font: 800 9px/1.2 'Manrope', 'Noto Sans SC', sans-serif;
  letter-spacing: 0.14em;
}

.timeline-lane__header {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
}

.timeline-lane__header + .timeline-lane__header {
  border-left: 1px solid var(--line-strong);
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
  font-size: clamp(22px, 2.2vw, 30px);
  line-height: 1.1;
}

.timeline-year-row {
  border-bottom: 1px solid var(--line-strong);
}

.timeline-year-marker {
  position: relative;
  min-height: 100%;
  border-right: 1px solid var(--line-strong);
  padding: 28px 12px 28px 0;
}

.timeline-year-marker time {
  display: block;
  color: var(--muted);
  font: 800 11px/1.2 'Manrope', 'Noto Sans SC', sans-serif;
  letter-spacing: 0.08em;
}

.timeline-year-marker span {
  position: absolute;
  top: 31px;
  right: -5px;
  width: 9px;
  height: 9px;
  border: 1px solid var(--ink);
  border-radius: 50%;
  background: var(--bg);
}

.timeline-year-lane {
  min-width: 0;
}

.timeline-year-lane--project {
  border-left: 1px solid var(--line-strong);
}

.timeline-year-lane__label {
  display: none;
}

.timeline-entry-shell + .timeline-entry-shell {
  border-top: 1px solid var(--line-strong);
}

.timeline-entry-shell {
  min-width: 0;
}

@media (max-width: 760px) {
  .timeline-page {
    overflow: visible;
    padding-right: 20px;
    padding-bottom: 80px;
    padding-left: 20px;
  }

  .timeline-intro {
    padding: 72px 0 58px;
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
    padding-top: 52px;
  }

  .timeline-columns {
    display: none;
  }

  .timeline-year-row {
    grid-template-columns: 48px minmax(0, 1fr);
  }

  .timeline-year-marker {
    grid-row: 1 / span 2;
    padding-top: 24px;
  }

  .timeline-year-marker time {
    font-size: 9px;
    writing-mode: vertical-rl;
  }

  .timeline-year-marker span {
    top: 27px;
  }

  .timeline-year-lane {
    grid-column: 2;
  }

  .timeline-year-lane--project {
    border-top: 1px solid var(--line-strong);
    border-left: 0;
  }

  .timeline-year-lane:empty,
  .timeline-year-lane--project:empty {
    display: none;
  }

  .timeline-year-lane__label {
    display: block;
    margin: 0;
    padding: 14px 18px 0;
    color: var(--muted);
    font: 800 9px/1.2 'Manrope', 'Noto Sans SC', sans-serif;
    letter-spacing: 0.12em;
  }
}
</style>
