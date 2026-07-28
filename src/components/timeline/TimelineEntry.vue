<template>
  <article
    class="timeline-entry"
    :class="{
      'is-active': active,
      'is-revealed': revealed,
    }"
    :aria-current="active ? 'step' : undefined"
  >
    <header class="timeline-entry__header">
      <time>{{ item.date }}</time>
      <span v-if="item.current" class="timeline-entry__now">NOW</span>
    </header>

    <div class="timeline-entry__body">
      <h3>{{ item.title }}</h3>
      <p class="timeline-entry__role">{{ item.role }}</p>
      <p class="timeline-entry__summary">{{ item.summary }}</p>

      <ul v-if="item.evidence.length" class="timeline-entry__evidence">
        <li v-for="evidence in item.evidence" :key="evidence">{{ evidence }}</li>
      </ul>

      <a v-if="item.projectId" class="timeline-entry__link" href="#work">
        查看相关项目
        <span aria-hidden="true">↘</span>
      </a>
    </div>
  </article>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  revealed: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.timeline-entry {
  position: relative;
  min-height: 0;
  padding: clamp(20px, 3vh, 30px) clamp(18px, 2.4vw, 28px);
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.16);
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 460ms ease, transform 460ms ease, background 240ms ease;
}

.timeline-entry.is-revealed {
  opacity: 1;
  transform: translateY(0);
}

.timeline-entry.is-active {
  background: rgba(255, 255, 255, 0.52);
  opacity: 1;
}

.timeline-entry__header {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.timeline-entry__header time,
.timeline-entry__now,
.timeline-entry__role {
  font-family: 'Manrope', 'Noto Sans SC', sans-serif;
}

.timeline-entry__header time {
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.5;
}

.timeline-entry__now {
  border-left: 2px solid var(--ink);
  padding-left: 8px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.timeline-entry__body {
  max-width: 760px;
}

.timeline-entry h3 {
  max-width: 20ch;
  margin-top: 18px;
  font-size: clamp(22px, 2vw, 28px);
  line-height: 1.08;
}

.timeline-entry__role {
  margin: 14px 0 0;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.5;
}

.timeline-entry__summary {
  max-width: 52ch;
  margin: 17px 0 0;
  color: #383a3a;
  font-size: clamp(14px, 1.2vw, 16px);
  line-height: 1.7;
}

.timeline-entry__evidence {
  display: grid;
  gap: 8px;
  max-width: 58ch;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.timeline-entry__evidence li {
  position: relative;
  padding-left: 17px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.65;
}

.timeline-entry__evidence li::before {
  position: absolute;
  top: 0.78em;
  left: 0;
  width: 8px;
  height: 1px;
  background: currentColor;
  content: '';
}

.timeline-entry__link {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  margin-top: 30px;
  border-bottom: 1px solid currentColor;
  padding-bottom: 5px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

@media (max-width: 760px) {
  .timeline-entry {
    padding: 22px 18px 38px;
  }

  .timeline-entry__header {
    justify-content: flex-start;
  }

  .timeline-entry h3 {
    max-width: 18ch;
    font-size: clamp(28px, 8vw, 38px);
  }

  .timeline-entry__summary {
    font-size: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .timeline-entry {
    transition: none;
  }
}
</style>
