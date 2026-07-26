<template>
  <aside
    class="timeline-rail"
    :style="{ '--timeline-progress': normalizedProgress }"
    aria-label="经历时间轴导航"
  >
    <div class="timeline-rail__sticky">
      <p class="timeline-rail__kicker">EXPERIENCE</p>

      <div class="timeline-rail__current">
        <span>ACTIVE YEAR</span>
        <strong>{{ activeYear }}</strong>
      </div>

      <div
        class="timeline-rail__progress"
        role="progressbar"
        aria-label="经历章节阅读进度"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="Math.round(normalizedProgress * 100)"
      >
        <span aria-hidden="true" />
      </div>

      <ol class="timeline-rail__years" aria-label="时间轴年份">
        <li
          v-for="year in years"
          :key="year.label"
          :class="{ 'is-active': year.label === activeYear }"
          :style="{ top: `${year.position}%` }"
        >
          {{ year.label }}
        </li>
      </ol>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  years: {
    type: Array,
    required: true,
  },
  activeYear: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    required: true,
  },
})

const normalizedProgress = computed(() => (
  Math.min(Math.max(props.progress, 0), 1)
))
</script>

<style scoped>
.timeline-rail {
  position: relative;
  min-width: 0;
}

.timeline-rail__sticky {
  position: sticky;
  top: clamp(28px, 6vh, 72px);
  height: min(76svh, 680px);
}

.timeline-rail__kicker,
.timeline-rail__current span {
  margin: 0;
  color: var(--muted);
  font-family: 'Manrope', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.timeline-rail__current {
  display: grid;
  gap: 7px;
  margin-top: clamp(52px, 9vh, 92px);
}

.timeline-rail__current strong {
  font-family: 'Fraunces', 'Noto Sans SC', serif;
  font-size: clamp(58px, 6vw, 94px);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 0.9;
}

.timeline-rail__progress {
  position: absolute;
  top: 44%;
  bottom: 0;
  left: 4px;
  width: 1px;
  overflow: hidden;
  background: var(--line);
}

.timeline-rail__progress span {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--ink);
  transform: scaleY(var(--timeline-progress));
  transform-origin: top;
}

.timeline-rail__years {
  position: absolute;
  top: 44%;
  right: 0;
  bottom: 0;
  left: 22px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline-rail__years li {
  position: absolute;
  left: 0;
  color: var(--muted);
  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  line-height: 1;
  transform: translateY(-50%);
  transition: color 180ms ease, font-weight 180ms ease;
}

.timeline-rail__years li::before {
  position: absolute;
  top: 50%;
  left: -22px;
  width: 9px;
  height: 1px;
  background: var(--line-strong);
  content: '';
}

.timeline-rail__years li.is-active {
  color: var(--ink);
  font-weight: 800;
}

@media (max-width: 760px) {
  .timeline-rail::before,
  .timeline-rail::after {
    position: absolute;
    top: 0;
    left: 7px;
    width: 1px;
    content: '';
  }

  .timeline-rail::before {
    bottom: 0;
    background: var(--line);
  }

  .timeline-rail::after {
    height: calc(var(--timeline-progress) * 100%);
    background: var(--ink);
  }

  .timeline-rail__sticky {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .timeline-rail__years li {
    transition: none;
  }
}
</style>
