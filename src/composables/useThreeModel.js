import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const CONFIGS = {
  drum: {
    url: '/drum_kit.glb',
    targetSize: 2.2,
    rotation: new THREE.Euler(-0.12, -0.42, 0),
    cameraPosition: new THREE.Vector3(0, 0.58, 4.35),
    sway: 0.075,
  },
  sewing: {
    url: '/sewing_machine.glb',
    targetSize: 1.82,
    rotation: new THREE.Euler(-0.1, 0.46, 0),
    cameraPosition: new THREE.Vector3(0, 0.44, 4.75),
    sway: 0,
  },
}

export function useThreeModel(canvasRef, modelKey) {
  const isLoaded = ref(false)
  const isError = ref(false)

  let scene, camera, renderer, model, animId, resizeObs
  let state = { w: 0, h: 0, baseRY: 0 }

  onMounted(() => {
    const canvas = canvasRef.value
    const cfg = CONFIGS[modelKey]
    if (!canvas || !cfg) return

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    renderer = new THREE.WebGLRenderer({
      canvas, alpha: true, antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    camera.position.copy(cfg.cameraPosition)
    camera.lookAt(0, 0, 0)
    state.baseRY = cfg.rotation.y

    scene.add(new THREE.HemisphereLight(0xf5f2ea, 0x090909, 1.9))
    const kl = new THREE.DirectionalLight(0xffffff, 2.1)
    kl.position.set(3.8, 4.2, 4.6)
    scene.add(kl)
    const rl = new THREE.DirectionalLight(0x69a7ff, 1.25)
    rl.position.set(-4.2, 2.8, -2.8)
    scene.add(rl)
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(1.65, 48),
      new THREE.MeshBasicMaterial({ color: 0xf5f2ea, transparent: true, opacity: 0.055 }),
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -1.36
    scene.add(floor)

    new GLTFLoader().load(cfg.url, (gltf) => {
      const box = new THREE.Box3().setFromObject(gltf.scene)
      const c = box.getCenter(new THREE.Vector3())
      const s = box.getSize(new THREE.Vector3())
      const max = Math.max(s.x, s.y, s.z) || 1
      gltf.scene.position.sub(c)
      gltf.scene.traverse((ch) => {
        if (!ch.isMesh) return
        ch.frustumCulled = false
        if (ch.material) { ch.material.envMapIntensity = 0.7; ch.material.needsUpdate = true }
      })
      const w = new THREE.Group()
      w.add(gltf.scene)
      w.scale.setScalar(cfg.targetSize / max)
      w.rotation.copy(cfg.rotation)
      scene.add(w)
      model = w
      isLoaded.value = true
    }, undefined, () => { isError.value = true })

    resizeObs = new ResizeObserver(() => resize())
    resizeObs.observe(canvas)

    const loop = (t) => {
      resize()
      if (model) model.rotation.y = state.baseRY + Math.sin(t * 0.00045) * (cfg.sway ?? 0.075)
      renderer.render(scene, camera)
      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)
  })

  function resize() {
    const cv = canvasRef.value
    if (!cv || !camera || !renderer) return
    const w = Math.max(1, cv.clientWidth)
    const h = Math.max(1, cv.clientHeight)
    if (w === state.w && h === state.h) return
    state.w = w; state.h = h
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h, false)
  }

  onUnmounted(() => {
    if (animId) cancelAnimationFrame(animId)
    if (resizeObs) resizeObs.disconnect()
    if (renderer) { renderer.dispose(); renderer.forceContextLoss() }
    scene?.traverse((o) => {
      o.geometry?.dispose()
      if (o.material) {
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose())
      }
    })
  })

  return { isLoaded, isError }
}
