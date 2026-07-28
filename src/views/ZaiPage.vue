<template>
  <section
    class="projects-page"
    aria-labelledby="work-title"
  >
    <header class="work-intro">
      <p>PROJECTS / MACBOOK WORKSPACE</p>
      <h2 id="work-title">{{ projectOverview.title }}</h2>
      <span>{{ projectOverview.summary }}</span>
    </header>

    <div class="work-layout" :class="{ 'has-active-project': activeProject }">
      <MacBookWorkspace
        :projects="projectList"
        :active-project="activeProject"
        @select="openProject"
        @close="closeProject"
      >
        <div v-if="isCompact" class="compact-screen-copy">
          <p>{{ activeProject?.kicker }}</p>
          <strong>{{ activeProject?.folderName }}</strong>
          <span>完整项目内容位于电脑下方。</span>
        </div>
        <component
          :is="activeComponent"
          v-else-if="activeComponent"
        />
      </MacBookWorkspace>

      <aside class="project-inspector" aria-label="项目说明与目录">
        <nav class="project-nav" aria-label="项目目录">
          <button
            type="button"
            :class="{ 'is-active': !activeProjectId }"
            :aria-current="!activeProjectId ? 'page' : undefined"
            @click="closeProject"
          >
            <span>00</span>
            <strong>项目总览</strong>
          </button>
          <button
            v-for="(project, index) in projectList"
            :key="project.id"
            type="button"
            :class="{ 'is-active': activeProjectId === project.id }"
            :aria-current="activeProjectId === project.id ? 'page' : undefined"
            data-cursor-label="OPEN"
            @click="openProject(project.id)"
          >
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <strong>{{ project.folderName }}</strong>
          </button>
        </nav>

        <Transition name="inspector-copy" mode="out-in">
          <article
            v-if="activeProject"
            :key="activeProject.id"
            class="project-copy is-active-project"
          >
            <div class="project-copy__identity">
              <p>{{ activeProject.kicker }}</p>
              <h3>{{ activeProject.folderName }}</h3>
              <span class="project-summary">{{ activeProject.summary }}</span>
            </div>

            <dl class="project-fact-strip">
              <div>
                <dt>ROLE</dt>
                <dd>{{ activeProject.role }}</dd>
              </div>
              <div>
                <dt>FOCUS</dt>
                <dd>{{ activeProject.problem }}</dd>
              </div>
              <div>
                <dt>PROOF</dt>
                <dd>{{ activeProject.evidence[0] }}</dd>
              </div>
            </dl>
          </article>

          <article v-else key="overview" class="project-copy is-overview">
            <p>FOUR PROJECTS / EQUAL WEIGHT</p>
            <h3>{{ projectOverview.title }}</h3>
            <span class="project-summary">{{ projectOverview.summary }}</span>
            <ol>
              <li v-for="project in projectList" :key="project.id">
                <strong>{{ project.folderName }}</strong>
                <span>{{ project.problem }}</span>
              </li>
            </ol>
            <small>点击电脑文件夹或上方目录进入项目；窗口左上角红点返回桌面。</small>
          </article>
        </Transition>
      </aside>
    </div>

    <div
      v-if="isCompact && activeComponent"
      class="compact-project-detail"
      :aria-label="`${activeProject.folderName}完整项目内容`"
    >
      <div class="compact-detail-heading">
        <p>FULL PROJECT / MOBILE</p>
        <h3>{{ activeProject.folderName }}</h3>
      </div>
      <component :is="activeComponent" />
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { projectList, projectOverview } from '../data/portfolio.js'
import AliyunProject from '../components/projects/AliyunProject.vue'
import DefectProject from '../components/projects/DefectProject.vue'
import GanttodoProject from '../components/projects/GanttodoProject.vue'
import MacBookWorkspace from '../components/projects/MacBookWorkspace.vue'
import ZhipuProject from '../components/projects/ZhipuProject.vue'

const activeProjectId = ref(null)
const isCompact = ref(false)
let compactQuery = null

const componentById = {
  aliyun: AliyunProject,
  zhipu: ZhipuProject,
  defect: DefectProject,
  ganttodo: GanttodoProject,
}

const activeProject = computed(() => (
  projectList.find((project) => project.id === activeProjectId.value) || null
))

const activeComponent = computed(() => (
  activeProjectId.value ? componentById[activeProjectId.value] : null
))

function openProject(projectId) {
  if (!componentById[projectId]) return
  activeProjectId.value = projectId
}

function closeProject() {
  activeProjectId.value = null
}

function syncCompactView(event) {
  isCompact.value = event.matches
}

onMounted(() => {
  compactQuery = window.matchMedia('(max-width: 760px)')
  isCompact.value = compactQuery.matches
  compactQuery.addEventListener?.('change', syncCompactView)
})

onBeforeUnmount(() => {
  compactQuery?.removeEventListener?.('change', syncCompactView)
})
</script>

<style scoped>
.projects-page {
  --work-width: min(calc(100vw - 48px), 1640px);

  min-height: 100svh;
  overflow: clip;
  padding: clamp(90px, 12vh, 150px) 0 clamp(80px, 10vh, 130px);
  background: #e3e4e2;
  color: #191b1b;
}

.work-intro {
  display: grid;
  width: min(calc(100vw - 48px), 1180px);
  gap: clamp(18px, 2.5vw, 34px);
  margin: 0 auto clamp(68px, 10vh, 120px);
  padding-bottom: clamp(42px, 6vh, 72px);
  border-bottom: 1px solid rgba(25, 27, 27, 0.2);
}

.work-intro > p,
.project-copy > p,
.compact-screen-copy p,
.compact-detail-heading p {
  margin: 0;
  color: rgba(25, 27, 27, 0.56);
  font: 700 0.7rem/1.2 var(--font-sans, sans-serif);
  letter-spacing: 0.15em;
}

.work-intro h2 {
  max-width: 14ch;
  font-size: clamp(2.5rem, 4.2vw, 4.8rem);
  line-height: 1;
}

.work-intro > span {
  max-width: 48rem;
  color: rgba(25, 27, 27, 0.64);
  font-size: clamp(0.95rem, 1.25vw, 1.15rem);
  line-height: 1.8;
}

.work-layout {
  display: grid;
  width: var(--work-width);
  grid-template-columns: minmax(0, 1fr) clamp(280px, 20vw, 340px);
  gap: clamp(22px, 2.8vw, 44px);
  align-items: center;
  margin: 0 auto;
}

.work-layout.has-active-project {
  grid-template-columns: minmax(0, 1fr);
  gap: 22px;
}

.project-inspector {
  min-width: 0;
  max-height: min(760px, calc(100svh - 96px));
  overflow: auto;
  padding-top: 64px;
  padding-left: clamp(16px, 2vw, 28px);
  border-left: 1px solid rgba(25, 27, 27, 0.18);
  scrollbar-width: thin;
}

.project-nav {
  display: grid;
  margin-bottom: 2rem;
  border-top: 1px solid rgba(25, 27, 27, 0.18);
}

.project-nav button {
  display: grid;
  min-width: 0;
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: 0.65rem;
  align-items: baseline;
  border: 0;
  border-bottom: 1px solid rgba(25, 27, 27, 0.18);
  padding: 0.75rem 0;
  background: transparent;
  color: rgba(25, 27, 27, 0.68);
  text-align: left;
  cursor: pointer;
  transition:
    color 160ms ease,
    padding-left 160ms ease;
}

.project-nav button:hover,
.project-nav button.is-active {
  padding-left: 0.35rem;
  color: #191b1b;
}

.project-nav button:focus-visible {
  outline: 2px solid #3f4644;
  outline-offset: -3px;
}

.project-nav button > span {
  font-size: 0.62rem;
  letter-spacing: 0.08em;
}

.project-nav button > strong {
  overflow: hidden;
  font-size: 0.75rem;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-copy {
  display: grid;
  gap: 1rem;
}

.project-copy.is-active-project {
  grid-template-columns: minmax(220px, 0.72fr) minmax(0, 1.8fr);
  gap: clamp(18px, 3vw, 42px);
  align-items: start;
}

.project-copy__identity {
  display: grid;
  gap: 0.7rem;
}

.project-fact-strip {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0 !important;
  margin: 0 !important;
  border-top: 1px solid rgba(25, 27, 27, 0.16);
}

.project-fact-strip > div {
  align-content: start;
  border-top: 0 !important;
  border-right: 1px solid rgba(25, 27, 27, 0.16);
  padding: 0.8rem 1rem !important;
}

.project-fact-strip > div:last-child {
  border-right: 0;
}

.work-layout.has-active-project .project-inspector {
  max-height: none;
  padding-top: 0;
  padding-left: 0;
  border-left: 0;
}

.work-layout.has-active-project .project-nav {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin-bottom: 1.2rem;
  border-top: 0;
  border-left: 1px solid rgba(25, 27, 27, 0.18);
}

.work-layout.has-active-project .project-nav button {
  display: block;
  min-height: 3.8rem;
  border-top: 1px solid rgba(25, 27, 27, 0.18);
  border-right: 1px solid rgba(25, 27, 27, 0.18);
  padding: 0.65rem;
}

.work-layout.has-active-project .project-nav button > span {
  display: block;
  margin-bottom: 0.35rem;
}

.work-layout.has-active-project .project-nav button > strong {
  display: block;
  white-space: normal;
}

.project-copy h3,
.compact-detail-heading h3 {
  margin: 0;
  font-family: var(--font-serif, serif);
  font-weight: 500;
}

.project-copy h3 {
  font-size: clamp(1.6rem, 2.4vw, 2.35rem);
  line-height: 1.08;
}

.project-summary {
  color: rgba(25, 27, 27, 0.65);
  font-size: 0.9375rem;
  line-height: 1.7;
}

.project-copy dl {
  display: grid;
  gap: 0;
  margin: 0.25rem 0 0;
}

.project-copy dl > div {
  display: grid;
  gap: 0.4rem;
  padding: 0.85rem 0;
  border-top: 1px solid rgba(25, 27, 27, 0.16);
}

.project-copy dt {
  font-size: 0.68rem;
  font-weight: 800;
}

.project-copy dd {
  margin: 0;
  color: rgba(25, 27, 27, 0.65);
  font-size: 0.9375rem;
  line-height: 1.6;
}

.project-copy ul {
  display: grid;
  gap: 0.35rem;
  margin: 0;
  padding-left: 1.05rem;
}

.project-copy.is-overview ol {
  display: grid;
  gap: 0;
  margin: 0.5rem 0 0;
  padding: 0;
  border-top: 1px solid rgba(25, 27, 27, 0.16);
  list-style: none;
}

.project-copy.is-overview li {
  display: grid;
  gap: 0.3rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid rgba(25, 27, 27, 0.16);
}

.project-copy.is-overview li strong {
  color: #191b1b;
  font-size: 1rem;
  line-height: 1.35;
}

.project-copy.is-overview li span,
.project-copy small {
  color: rgba(25, 27, 27, 0.58);
  font-size: 0.875rem;
  line-height: 1.55;
}

.compact-screen-copy {
  display: grid;
  height: 100%;
  align-content: center;
  justify-items: center;
  gap: 0.4rem;
  padding: 1rem;
  text-align: center;
}

.compact-screen-copy strong {
  font-family: var(--font-serif, serif);
  font-size: clamp(0.7rem, 3vw, 1rem);
}

.compact-screen-copy span {
  color: rgba(25, 27, 27, 0.55);
  font-size: 0.48rem;
}

.compact-project-detail {
  display: none;
}

.inspector-copy-enter-active {
  transition:
    opacity 260ms ease,
    transform 260ms ease;
}

.inspector-copy-leave-active {
  transition:
    opacity 140ms ease,
    transform 140ms ease;
}

.inspector-copy-enter-from,
.inspector-copy-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 1080px) {
  .projects-page {
    --work-width: min(calc(100vw - 32px), 1320px);
  }

  .work-layout {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .project-inspector {
    max-height: none;
    padding-top: 0;
    padding-left: 0;
    border-left: 0;
  }

  .project-nav {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    border-top: 0;
    border-left: 1px solid rgba(25, 27, 27, 0.18);
  }

  .project-nav button {
    display: block;
    min-height: 4.2rem;
    border-top: 1px solid rgba(25, 27, 27, 0.18);
    border-right: 1px solid rgba(25, 27, 27, 0.18);
    padding: 0.65rem;
  }

  .project-nav button:hover,
  .project-nav button.is-active {
    padding-left: 0.85rem;
  }

  .project-nav button > span {
    display: block;
    margin-bottom: 0.45rem;
  }

  .project-nav button > strong {
    display: block;
    white-space: normal;
  }

  .project-copy dl {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 2rem;
  }
}

@media (max-width: 760px) {
  .projects-page {
    --work-width: calc(100vw - 16px);

    overflow: hidden;
    padding: 82px 0 72px;
  }

  .work-intro {
    width: calc(100vw - 40px);
    margin-bottom: 54px;
    padding-bottom: 40px;
  }

  .work-intro h2 {
    max-width: 10ch;
    font-size: clamp(2.6rem, 12vw, 3.6rem);
  }

  .project-nav {
    grid-template-columns: 1fr;
    border-top: 1px solid rgba(25, 27, 27, 0.18);
    border-left: 0;
  }

  .project-nav button {
    display: grid;
    min-height: 0;
    grid-template-columns: 2rem minmax(0, 1fr);
    border-top: 0;
    border-right: 0;
    padding: 0.8rem 0;
  }

  .project-nav button:hover,
  .project-nav button.is-active {
    padding-left: 0.35rem;
  }

  .project-nav button > span {
    margin: 0;
  }

  .project-nav button > strong {
    white-space: nowrap;
  }

  .project-copy {
    padding: 0 12px;
  }

  .project-copy.is-active-project {
    grid-template-columns: 1fr;
  }

  .project-fact-strip {
    grid-template-columns: 1fr;
  }

  .project-fact-strip > div {
    border-right: 0;
    border-bottom: 1px solid rgba(25, 27, 27, 0.16);
    padding-right: 0 !important;
    padding-left: 0 !important;
  }

  .work-layout.has-active-project .project-nav {
    grid-template-columns: 1fr;
    border-top: 1px solid rgba(25, 27, 27, 0.18);
    border-left: 0;
  }

  .work-layout.has-active-project .project-nav button {
    display: grid;
    min-height: 0;
    grid-template-columns: 2rem minmax(0, 1fr);
    border-top: 0;
    border-right: 0;
    padding: 0.8rem 0;
  }

  .project-copy dl {
    grid-template-columns: 1fr;
  }

  .project-summary,
  .project-copy dd,
  .project-copy.is-overview li span,
  .project-copy small {
    font-size: 0.9375rem;
  }

  .compact-project-detail {
    display: block;
    width: calc(100vw - 16px);
    margin: 4rem auto 0;
    border-top: 1px solid rgba(25, 27, 27, 0.2);
    background: #f8f7f3;
  }

  .compact-detail-heading {
    display: grid;
    gap: 0.45rem;
    padding: 1rem;
    border-bottom: 1px solid rgba(25, 27, 27, 0.16);
  }

  .compact-detail-heading h3 {
    font-size: 1.45rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-nav button,
  .inspector-copy-enter-active,
  .inspector-copy-leave-active {
    transition: none;
  }

  .inspector-copy-enter-from,
  .inspector-copy-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>
