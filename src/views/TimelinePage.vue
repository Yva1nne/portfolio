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
      <img
        class="timeline-thread"
        src="/timeline/timeline-thread.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      >

      <header class="timeline-columns">
        <div
          v-for="lane in timelineLanes"
          :key="lane.id"
          class="timeline-lane__header"
          :class="`timeline-lane__header--${lane.id}`"
        >
          <span>{{ lane.number }} / {{ lane.kicker }}</span>
          <h3 :id="`timeline-lane-${lane.id}`">{{ lane.title }}</h3>
        </div>
      </header>

      <section
        v-for="group in timelineGroups"
        :key="group.year"
        class="timeline-year-row"
        :style="{ '--year-accent': group.accent }"
        :aria-labelledby="`timeline-year-${group.year}`"
      >
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

        <header class="timeline-year-marker">
          <span aria-hidden="true"></span>
          <time :id="`timeline-year-${group.year}`">{{ group.year }}</time>
        </header>
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

const timelineAccents = ['#3659b8', '#d76b2c', '#d5a526', '#6d8b78']

const timelineGroups = computed(() => (
  [...new Set(timelineItems.map((item) => item.year))].map((year, index) => ({
    year,
    accent: timelineAccents[index % timelineAccents.length],
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
  --timeline-axis: clamp(88px, 9vw, 122px);
  --timeline-left: 31%;

  position: relative;
  max-width: 1180px;
  margin: 0 auto;
  padding-top: clamp(52px, 8vh, 88px);
}

.timeline-columns,
.timeline-year-row {
  display: grid;
  grid-template-columns: var(--timeline-left) var(--timeline-axis) minmax(0, 1fr);
}

.timeline-columns {
  position: relative;
  z-index: 2;
  align-items: end;
  margin-bottom: 18px;
}

.timeline-lane__header {
  display: grid;
  gap: 7px;
  min-width: 0;
  padding-bottom: 16px;
}

.timeline-lane__header--education {
  grid-column: 1;
  justify-items: end;
  padding-right: 28px;
  text-align: right;
}

.timeline-lane__header--project {
  grid-column: 3;
  padding-left: 34px;
}

.timeline-lane__header > span {
  color: var(--muted);
  font-family: 'Manrope', 'Noto Sans SC', sans-serif;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.timeline-lane__header h3 {
  font-size: clamp(22px, 2.2vw, 30px);
  line-height: 1.1;
}

.timeline-year-row {
  position: relative;
  z-index: 2;
  align-items: start;
  min-height: 250px;
  padding: clamp(28px, 4.5vh, 52px) 0;
}

.timeline-year-marker {
  position: relative;
  grid-column: 2;
  grid-row: 1;
  display: grid;
  justify-items: center;
  gap: 10px;
  padding-top: 8px;
}

.timeline-year-marker time {
  color: var(--ink);
  font: 800 11px/1.2 'Manrope', 'Noto Sans SC', sans-serif;
  letter-spacing: 0.08em;
}

.timeline-year-marker span {
  width: 17px;
  height: 17px;
  border: 4px solid var(--bg);
  border-radius: 50%;
  background: var(--year-accent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--year-accent) 70%, var(--ink));
}

.timeline-year-lane {
  display: grid;
  gap: 26px;
  min-width: 0;
}

.timeline-year-lane--education {
  grid-column: 1;
  grid-row: 1;
  padding-right: 28px;
}

.timeline-year-lane--project {
  grid-column: 3;
  grid-row: 1;
  padding-left: 34px;
}

.timeline-year-lane__label {
  display: none;
}

.timeline-entry-shell {
  min-width: 0;
}

.timeline-year-lane--education :deep(.timeline-entry) {
  text-align: right;
}

.timeline-year-lane--education :deep(.timeline-entry__header) {
  justify-content: flex-end;
}

.timeline-year-lane--education :deep(.timeline-entry__body) {
  margin-left: auto;
}

.timeline-year-lane--education :deep(.timeline-entry__evidence li) {
  padding-right: 17px;
  padding-left: 0;
}

.timeline-year-lane--education :deep(.timeline-entry__evidence li::before) {
  right: 0;
  left: auto;
}

.timeline-thread {
  position: absolute;
  z-index: 1;
  top: 106px;
  bottom: 12px;
  left: calc(var(--timeline-left) + var(--timeline-axis) / 2);
  width: min(86px, var(--timeline-axis));
  height: calc(100% - 118px);
  object-fit: fill;
  opacity: 0.82;
  transform: translateX(-50%);
  pointer-events: none;
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
    --timeline-axis: 42px;
    --timeline-left: 0px;

    padding-top: 52px;
  }

  .timeline-columns {
    display: none;
  }

  .timeline-year-row {
    grid-template-columns: var(--timeline-axis) minmax(0, 1fr);
    padding: 24px 0 34px;
  }

  .timeline-year-marker {
    grid-column: 1;
    grid-row: 1 / span 2;
    justify-items: start;
    padding-top: 8px;
  }

  .timeline-year-marker time {
    font-size: 9px;
    font-size: 9px;
  }

  .timeline-year-lane {
    grid-column: 2;
    padding-right: 0;
    padding-left: 16px;
  }

  .timeline-year-lane--project {
    grid-row: 2;
    margin-top: 22px;
  }

  .timeline-year-lane:empty,
  .timeline-year-lane--project:empty {
    display: none;
  }

  .timeline-year-lane__label {
    display: block;
    margin: 0;
    padding: 0 0 8px;
    color: var(--muted);
    font: 800 9px/1.2 'Manrope', 'Noto Sans SC', sans-serif;
    letter-spacing: 0.12em;
  }

  .timeline-year-lane--education :deep(.timeline-entry),
  .timeline-year-lane--education :deep(.timeline-entry__header) {
    justify-content: flex-start;
    text-align: left;
  }

  .timeline-year-lane--education :deep(.timeline-entry__body) {
    margin-left: 0;
  }

  .timeline-year-lane--education :deep(.timeline-entry__evidence li) {
    padding-right: 0;
    padding-left: 17px;
  }

  .timeline-year-lane--education :deep(.timeline-entry__evidence li::before) {
    right: auto;
    left: 0;
  }

  .timeline-thread {
    top: 48px;
    left: 18px;
    width: 34px;
    height: calc(100% - 54px);
  }
}
</style>
