import { cp, mkdir, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))
const publicRoot = path.join(projectRoot, 'public')
const outputRoot = path.join(projectRoot, 'dist')
const deferredPublicEntries = new Set([
  'drum_kit.glb',
  'hobby',
  'hobby-optimized',
  'sewing_machine.glb',
])

function copyPhaseOnePublicAssets() {
  return {
    name: 'copy-phase-one-public-assets',
    apply: 'build',
    async closeBundle() {
      await mkdir(outputRoot, { recursive: true })
      const entries = await readdir(publicRoot, { withFileTypes: true })

      await Promise.all(entries
        .filter((entry) => entry.name !== '.DS_Store' && !deferredPublicEntries.has(entry.name))
        .map((entry) => cp(
          path.join(publicRoot, entry.name),
          path.join(outputRoot, entry.name),
          { recursive: entry.isDirectory() },
        )))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), copyPhaseOnePublicAssets()],
  build: {
    copyPublicDir: false,
    rolldownOptions: {
      checks: {
        pluginTimings: false,
      },
    },
  },
})
