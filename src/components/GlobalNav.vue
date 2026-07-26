<template>
  <nav
    class="global-nav"
    aria-label="作品集章节导航"
    @keydown.esc="closeMenu"
  >
    <div class="desktop-nav">
      <span class="desktop-nav__line" aria-hidden="true" />
      <a
        v-for="item in navItems"
        :key="item.id"
        :href="`#${item.id}`"
        :aria-current="activeId === item.id ? 'location' : undefined"
        @click="navigateTo($event, item.id)"
      >
        <span aria-hidden="true" />
        {{ item.label }}
      </a>
    </div>

    <button
      ref="menuButton"
      class="menu-button"
      type="button"
      :aria-expanded="menuOpen"
      aria-controls="portfolio-mobile-nav"
      @click="toggleMenu"
    >
      <span>MENU</span>
      <i aria-hidden="true">{{ menuOpen ? '×' : '＋' }}</i>
    </button>

    <div
      v-if="menuOpen"
      id="portfolio-mobile-nav"
      class="mobile-menu"
    >
      <header>
        <span>NAVIGATION</span>
        <button ref="closeButton" type="button" aria-label="关闭章节菜单" @click="closeMenu">
          CLOSE
        </button>
      </header>

      <a
        v-for="(item, index) in navItems"
        :key="item.id"
        :href="`#${item.id}`"
        :aria-current="activeId === item.id ? 'location' : undefined"
        @click="navigateTo($event, item.id)"
      >
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        <strong>{{ item.label }}</strong>
        <i v-if="activeId === item.id" aria-hidden="true" />
      </a>
    </div>
  </nav>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const navItems = [
  { id: 'about', label: 'ABOUT' },
  { id: 'timeline', label: 'TIMELINE' },
  { id: 'work', label: 'WORK' },
]

const activeId = ref(navItems[0].id)
const menuOpen = ref(false)
const menuButton = ref(null)
const closeButton = ref(null)

const observedSections = new Map()
const visibleSections = new Map()

let sectionObserver = null
let sectionMutationObserver = null
let reducedMotionQuery = null
let mobileQuery = null

function selectVisibleSection() {
  if (!visibleSections.size) return

  const focusY = window.innerHeight * 0.32
  let nextId = activeId.value
  let nearestDistance = Number.POSITIVE_INFINITY

  visibleSections.forEach((entry, id) => {
    const rect = entry.target.getBoundingClientRect()
    const distance = Math.abs(rect.top - focusY)

    if (distance < nearestDistance) {
      nearestDistance = distance
      nextId = id
    }
  })

  activeId.value = nextId
}

function createSectionObserver() {
  if (!('IntersectionObserver' in window)) return

  sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id
      if (!id) return

      if (entry.isIntersecting) {
        visibleSections.set(id, entry)
      } else {
        visibleSections.delete(id)
      }
    })

    selectVisibleSection()
  }, {
    root: null,
    rootMargin: '-24% 0px -60% 0px',
    threshold: 0,
  })
}

function observeAvailableSections() {
  navItems.forEach(({ id }) => {
    if (observedSections.has(id)) return

    const section = document.getElementById(id)
    if (!section) return

    observedSections.set(id, section)
    sectionObserver?.observe(section)
  })

  if (observedSections.size === navItems.length) {
    sectionMutationObserver?.disconnect()
    sectionMutationObserver = null
  }
}

function watchForAsyncSections() {
  if (observedSections.size === navItems.length || !('MutationObserver' in window)) return

  sectionMutationObserver = new MutationObserver(observeAvailableSections)
  sectionMutationObserver.observe(document.body, { childList: true, subtree: true })
}

function closeMenu() {
  if (!menuOpen.value) return
  menuOpen.value = false
  nextTick(() => menuButton.value?.focus({ preventScroll: true }))
}

async function toggleMenu() {
  if (menuOpen.value) {
    closeMenu()
    return
  }

  menuOpen.value = true
  await nextTick()
  closeButton.value?.focus({ preventScroll: true })
}

function navigateTo(event, id) {
  event.preventDefault()

  const target = document.getElementById(id)
  if (!target) return

  activeId.value = id
  target.scrollIntoView({
    behavior: reducedMotionQuery?.matches ? 'auto' : 'smooth',
    block: 'start',
  })

  if (menuOpen.value) closeMenu()
}

function onMobilePreferenceChange(event) {
  if (!event.matches) menuOpen.value = false
}

function addMediaListener(query, listener) {
  if (query.addEventListener) {
    query.addEventListener('change', listener)
  } else {
    query.addListener?.(listener)
  }
}

function removeMediaListener(query, listener) {
  if (query.removeEventListener) {
    query.removeEventListener('change', listener)
  } else {
    query.removeListener?.(listener)
  }
}

onMounted(() => {
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  mobileQuery = window.matchMedia('(max-width: 760px)')
  addMediaListener(mobileQuery, onMobilePreferenceChange)

  createSectionObserver()
  observeAvailableSections()
  watchForAsyncSections()
})

onBeforeUnmount(() => {
  sectionObserver?.disconnect()
  sectionMutationObserver?.disconnect()
  visibleSections.clear()
  observedSections.clear()

  if (mobileQuery) removeMediaListener(mobileQuery, onMobilePreferenceChange)
})
</script>

<style scoped>
.global-nav {
  position: fixed;
  top: clamp(18px, 2.5vw, 34px);
  right: clamp(18px, 2.6vw, 44px);
  z-index: 90;
  color: var(--ink);
}

.desktop-nav {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: clamp(14px, 1.6vw, 24px);
  padding: 0 8px;
}

.desktop-nav__line {
  position: absolute;
  top: 3px;
  right: 8px;
  left: 8px;
  height: 1px;
  background: var(--line);
}

.desktop-nav a {
  position: relative;
  display: grid;
  min-height: 34px;
  grid-template-rows: 7px minmax(0, 1fr);
  gap: 7px;
  align-items: center;
  justify-items: center;
  color: var(--muted);
  font-family: 'Manrope', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-decoration: none;
  transition: color 160ms ease;
}

.desktop-nav a > span {
  position: relative;
  z-index: 1;
  width: 7px;
  height: 7px;
  border: 1px solid var(--line-strong);
  background: var(--bg);
  transform: scale(0.48);
  transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
}

.desktop-nav a:hover,
.desktop-nav a[aria-current='location'] {
  color: var(--ink);
}

.desktop-nav a[aria-current='location'] > span {
  border-color: var(--ink);
  background: var(--ink);
  transform: scale(1);
}

.desktop-nav a:focus-visible,
.menu-button:focus-visible,
.mobile-menu a:focus-visible,
.mobile-menu header button:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 4px;
}

.menu-button,
.mobile-menu {
  display: none;
}

@media (max-width: 760px) {
  .global-nav {
    top: 14px;
    right: 14px;
  }

  .desktop-nav {
    display: none;
  }

  .menu-button {
    display: flex;
    width: 82px;
    min-height: 38px;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border: 1px solid var(--line-strong);
    padding: 0 11px;
    background: rgba(228, 229, 228, 0.92);
    color: var(--ink);
    font-family: 'Manrope', sans-serif;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.13em;
    cursor: pointer;
    backdrop-filter: blur(10px);
  }

  .menu-button i {
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
  }

  .mobile-menu {
    position: absolute;
    top: 0;
    right: 0;
    display: grid;
    width: min(270px, calc(100vw - 28px));
    border: 1px solid var(--line-strong);
    background: rgba(228, 229, 228, 0.97);
    box-shadow: 0 18px 48px rgba(24, 26, 28, 0.14);
    backdrop-filter: blur(14px);
  }

  .mobile-menu header {
    display: flex;
    min-height: 42px;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    border-bottom: 1px solid var(--line);
    padding: 0 13px;
    color: var(--muted);
    font-family: 'Manrope', sans-serif;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.14em;
  }

  .mobile-menu header button {
    min-width: 44px;
    min-height: 44px;
    border: 0;
    padding: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  .mobile-menu > a {
    position: relative;
    display: grid;
    min-height: 54px;
    grid-template-columns: 28px minmax(0, 1fr) 8px;
    gap: 10px;
    align-items: center;
    border-bottom: 1px solid var(--line);
    padding: 0 13px;
    color: var(--muted);
    font-family: 'Manrope', sans-serif;
    text-decoration: none;
  }

  .mobile-menu > a:last-child {
    border-bottom: 0;
  }

  .mobile-menu > a > span {
    font-size: 9px;
    letter-spacing: 0.08em;
  }

  .mobile-menu > a > strong {
    font-size: 11px;
    letter-spacing: 0.11em;
  }

  .mobile-menu > a > i {
    width: 6px;
    height: 6px;
    background: var(--ink);
  }

  .mobile-menu > a:hover,
  .mobile-menu > a[aria-current='location'] {
    color: var(--ink);
  }
}

@media (prefers-reduced-motion: reduce) {
  .desktop-nav a,
  .desktop-nav a > span {
    transition: none;
  }
}
</style>
