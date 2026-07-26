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
      <p class="timeline-entry__year" aria-hidden="true">{{ item.year }}</p>
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
  display: grid;
  min-height: 46svh;
  align-content: start;
  grid-template-columns: minmax(118px, 0.32fr) minmax(0, 1fr);
  gap: clamp(28px, 5vw, 78px);
  border-top: 1px solid var(--line-strong);
  padding: clamp(46px, 8vh, 86px) 0;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 460ms ease, transform 460ms ease;
}

.timeline-entry.is-revealed {
  opacity: 1;
  transform: translateY(0);
}

.timeline-entry.is-active {
  opacity: 1;
}

.timeline-entry::before {
  position: absolute;
  top: -1px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--ink);
  content: '';
  transition: width 240ms ease;
}

.timeline-entry.is-active::before {
  width: clamp(64px, 9vw, 132px);
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
.timeline-entry__role,
.timeline-entry__year {
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

.timeline-entry__year {
  display: none;
  margin: 0 0 14px;
  color: var(--muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.timeline-entry h3 {
  max-width: 18ch;
  font-size: clamp(38px, 4.3vw, 62px);
  line-height: 1.04;
}

.timeline-entry__role {
  margin: 18px 0 0;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.5;
}

.timeline-entry__summary {
  max-width: 52ch;
  margin: 22px 0 0;
  color: #383a3a;
  font-size: clamp(15px, 1.35vw, 18px);
  line-height: 1.75;
}

.timeline-entry__evidence {
  display: grid;
  gap: 8px;
  max-width: 58ch;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}

.timeline-entry__evidence li {
  position: relative;
  padding-left: 17px;
  color: var(--muted);
  font-size: 15px;
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

@media (max-width: 900px) {
  .timeline-entry {
    grid-template-columns: minmax(100px, 0.28fr) minmax(0, 1fr);
    gap: 28px;
  }
}

@media (max-width: 760px) {
  .timeline-entry {
    display: block;
    min-height: 46svh;
    padding: 44px 0 60px;
  }

  .timeline-entry::after {
    position: absolute;
    top: 44px;
    left: -29px;
    width: 9px;
    height: 9px;
    border: 1px solid var(--line-strong);
    background: var(--bg);
    content: '';
    transform: translateX(-50%);
  }

  .timeline-entry.is-active::after {
    border-color: var(--ink);
    background: var(--ink);
  }

  .timeline-entry__header {
    justify-content: flex-start;
  }

  .timeline-entry__year {
    display: block;
    margin-top: 28px;
  }

  .timeline-entry h3 {
    max-width: 15ch;
    font-size: clamp(34px, 10.5vw, 48px);
  }

  .timeline-entry__summary {
    font-size: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .timeline-entry,
  .timeline-entry::before {
    transition: none;
  }
}
</style>
