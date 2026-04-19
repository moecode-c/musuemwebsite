const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const dpr = window.devicePixelRatio || 1

const BASE_VIEW_W = 1024
const BASE_VIEW_H = 576
const TILE_SIZE = 16

// Map dimensions (rows x cols)
// Derive from the exported layer data so collisions match what is rendered.
const MAP_ROWS = Array.isArray(l_terrain) ? l_terrain.length : 0
const MAP_COLS = Array.isArray(l_terrain?.[0]) ? l_terrain[0].length : 0

const normalizeLayer = (layer, rows, cols) =>
  Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => layer?.[y]?.[x] ?? 0),
  )

const collisionsProvided =
  typeof collisions !== 'undefined' && Array.isArray(collisions)
const collisionsData = collisionsProvided
  ? normalizeLayer(collisions, MAP_ROWS, MAP_COLS)
  : null

if (collisionsProvided) {
  const collisionsRows = collisions.length
  const collisionsCols = Array.isArray(collisions?.[0]) ? collisions[0].length : 0
  if (collisionsRows !== MAP_ROWS || collisionsCols !== MAP_COLS) {
    console.warn(
      'Collision grid size does not match the map. Using normalized collision data.',
    )
  }
}

const layersData = {
  l_terrain: normalizeLayer(l_terrain, MAP_ROWS, MAP_COLS),
  l_boats: normalizeLayer(l_boats, MAP_ROWS, MAP_COLS),
  l_buldings: normalizeLayer(l_buldings, MAP_ROWS, MAP_COLS),
  l_characters: normalizeLayer(l_characters, MAP_ROWS, MAP_COLS),
  l_New_Layer_4: normalizeLayer(l_New_Layer_4, MAP_ROWS, MAP_COLS),
}

const tilesets = {
  l_terrain: { imageUrl: './images/terrain.png', tileSize: 16 },
  l_boats: { imageUrl: './images/terrain.png', tileSize: 16 },
  l_buldings: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_characters: { imageUrl: './images/characters.png', tileSize: 16 },
  l_New_Layer_4: { imageUrl: './images/decorations.png', tileSize: 16 },
};


// Tile setup
const collisionBlocks = []
const blockSize = TILE_SIZE // Assuming each tile is 16x16 pixels
let debugDrawCollisions = false
const CLICK_STEP = 12
let camX = 0
let camY = 0

// Tiles that should NOT be solid even if present in a "solid" layer.
// (Your bridge tiles are in `l_buldings` around ids 983..1057.)
const NON_SOLID_TILE_IDS = new Set([
  983, 984, 985,
  1019, 1020, 1021,
  1055, 1056, 1057,
])

const WORLD_ROWS = MAP_ROWS
const WORLD_COLS = MAP_COLS
const WORLD_W = WORLD_COLS * TILE_SIZE
const WORLD_H = WORLD_ROWS * TILE_SIZE

const getViewportSize = () => {
  if (WORLD_W <= 0 || WORLD_H <= 0) {
    return { width: BASE_VIEW_W, height: BASE_VIEW_H }
  }

  const viewHeight = Math.min(BASE_VIEW_H, WORLD_H)
  const viewWidth = Math.min(BASE_VIEW_W, Math.floor((viewHeight * 16) / 9), WORLD_W)

  return {
    width: Math.max(16, viewWidth),
    height: Math.max(9, Math.floor((viewWidth * 9) / 16)),
  }
}

const { width: VIEW_W, height: VIEW_H } = getViewportSize()

canvas.width = VIEW_W * dpr
canvas.height = VIEW_H * dpr

const gridHasSolids = (grid) => grid.some((row) => row.some((v) => v !== 0))

const buildCollisionBlocks = () => {
  collisionBlocks.length = 0

  // Prefer the explicit collision layer if it has data.
  // Your current `data/collisions.js` is all zeros, so we fall back.
  const solidSet = new Set()

  const markSolidsFromGrid = (grid) => {
    grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0 && !NON_SOLID_TILE_IDS.has(value)) {
          solidSet.add(y * WORLD_COLS + x)
        }
      })
    })
  }

  // 1) Preferred: explicit collision map (you control exactly what is solid).
  // If it exists AND matches the expected dimensions, it is authoritative
  // even if it's all zeros.
  const hasCollisionMap = Array.isArray(collisionsData)

  if (hasCollisionMap) {
    markSolidsFromGrid(collisionsData)
  } else {
    // 2) Practical default: build collision from map layers.
    // - `l_buldings` contains walls/structures (but also includes bridge tiles -> excluded above)
    // - `l_New_Layer_4` often holds extra blockers
    if (gridHasSolids(layersData.l_buldings)) markSolidsFromGrid(layersData.l_buldings)
    if (gridHasSolids(layersData.l_New_Layer_4)) markSolidsFromGrid(layersData.l_New_Layer_4)

    // IMPORTANT: Do NOT make characters/guards solid.
    // Collisions should come from walls/structures only.
  }

  for (const id of solidSet) {
    const y = Math.floor(id / WORLD_COLS)
    const x = id % WORLD_COLS
    collisionBlocks.push(
      new CollisionBlock({
        x: x * blockSize,
        y: y * blockSize,
        size: blockSize,
      }),
    )
  }

  if (collisionBlocks.length === 0) {
    console.warn('No collision blocks were generated. Check data/collisions.js or layer data.')
  }
}

buildCollisionBlocks()

const renderLayer = (tilesData, tilesetImage, tileSize, context) => {
  // Calculate the number of tiles per row in the tileset
  // We use Math.ceil to ensure we get a whole number of tiles
  const tilesPerRow = Math.ceil(tilesetImage.width / tileSize)

  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        // Adjust index to be 0-based for calculations
        const tileIndex = symbol - 1

        // Calculate source coordinates
        const srcX = (tileIndex % tilesPerRow) * tileSize
        const srcY = Math.floor(tileIndex / tilesPerRow) * tileSize

        context.drawImage(
          tilesetImage, // source image
          srcX,
          srcY, // source x, y
          tileSize,
          tileSize, // source width, height
          x * TILE_SIZE,
          y * TILE_SIZE, // destination x, y
          TILE_SIZE,
          TILE_SIZE, // destination width, height
        )
      }
    })
  })
}

const renderLayerFallback = (tilesData, layerName, context) => {
  // Simple, always-works renderer if tileset images are missing.
  // It draws colored squares for non-zero tiles so you can still see the map.
  const palette = {
    l_terrain: 'rgba(80, 200, 120, 0.70)',
    l_boats: 'rgba(80, 160, 255, 0.70)',
    l_buldings: 'rgba(220, 180, 120, 0.70)',
    l_characters: 'rgba(230, 90, 90, 0.70)',
    l_New_Layer_4: 'rgba(180, 120, 220, 0.70)',
  }

  context.fillStyle = palette[layerName] ?? 'rgba(200, 200, 200, 0.60)'
  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
      }
    })
  })
}

const renderStaticLayers = async () => {
  const offscreenCanvas = document.createElement('canvas')
  // Render the full world (not just the viewport).
  offscreenCanvas.width = WORLD_W
  offscreenCanvas.height = WORLD_H
  const offscreenContext = offscreenCanvas.getContext('2d')

  for (const [layerName, tilesData] of Object.entries(layersData)) {
    const tilesetInfo = tilesets[layerName]
    if (tilesetInfo) {
      try {
        const tilesetImage = await loadImage(tilesetInfo.imageUrl)
        renderLayer(
          tilesData,
          tilesetImage,
          tilesetInfo.tileSize,
          offscreenContext,
        )
      } catch (error) {
        console.warn(
          `Tileset missing for ${layerName}. Using fallback colors.`,
          error,
        )
        renderLayerFallback(tilesData, layerName, offscreenContext)
      }
    }
  }

  // Optionally draw collision blocks and platforms for debugging
  // collisionBlocks.forEach(block => block.draw(offscreenContext));

  return offscreenCanvas
}
// END - Tile setup

// Change xy coordinates to move player's default position
const player = new Player({
  x: 100,
  y: 100,
  size: 15,
})

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

const modalBackdrop = document.querySelector('#modalBackdrop')
const infoModal = document.querySelector('#infoModal')
const modalText = infoModal?.querySelector('.modal-card__text')
const modalClose = infoModal?.querySelector('.modal-card__close')

let messageHideTimer = null
let activeTriggerKey = null
let dismissedTriggerKey = null
let isPaused = false

const triggerBlocks = [
  {
    id: 'egypt-1',
    x: 19,
    y: 7,
    width: 1,
    height: 1,
    message:
      'The Nile River flooded each year, leaving rich soil on its banks. Farmers planted wheat and barley in this fresh mud, which helped towns grow. Egyptians watched the stars to predict the flood season so they could prepare their fields and irrigation canals.'
  },
  {
    id: 'egypt-2',
    x: 20,
    y: 19,
    width: 1,
    height: 1,
    message:
      'Ancient Egyptians wrote in hieroglyphs, a picture-based writing system. Scribes used reed pens and ink on papyrus, a paper made from a river plant. Writing helped keep track of harvests, taxes, and stories about their gods and kings.'
  },
  {
    id: 'egypt-3',
    x: 10,
    y: 15,
    width: 1,
    height: 1,
    message:
      'Mummification was a careful process that could take about 70 days. Egyptians removed organs, dried the body with natron salt, and wrapped it in linen. They believed this helped the spirit live on in the afterlife.'
  },
  {
    id: 'egypt-4',
    x: 40,
    y: 20,
    width: 1,
    height: 1,
    message:
      'The Great Pyramid of Giza was built from about 2.3 million stone blocks. Workers organized in teams, hauled stones on sleds, and used ramps to lift them. It stayed the tallest man-made structure for thousands of years.'
  },
]

const getTriggerAtPlayer = (playerRef) => {
  const hb = playerRef.hitbox

  for (let i = 0; i < triggerBlocks.length; i++) {
    const t = triggerBlocks[i]
    const tX = t.x * TILE_SIZE
    const tY = t.y * TILE_SIZE
    const tW = (t.width ?? 1) * TILE_SIZE
    const tH = (t.height ?? 1) * TILE_SIZE

    const hit =
      hb.x <= tX + tW &&
      hb.x + hb.width >= tX &&
      hb.y + hb.height >= tY &&
      hb.y <= tY + tH

    if (hit) return t
  }

  return null
}

const showMessageModal = (text, key) => {
  if (!infoModal || !modalText || !modalBackdrop) return

  modalText.textContent = text
  infoModal.classList.add('is-visible')
  modalBackdrop.classList.add('is-visible')
  infoModal.setAttribute('aria-hidden', 'false')
  modalBackdrop.setAttribute('aria-hidden', 'false')
  activeTriggerKey = key
  dismissedTriggerKey = null
  isPaused = true

  if (messageHideTimer) {
    window.clearTimeout(messageHideTimer)
    messageHideTimer = null
  }
}

const hideMessageModal = () => {
  if (!infoModal || !modalText || !modalBackdrop) return

  infoModal.classList.remove('is-visible')
  modalBackdrop.classList.remove('is-visible')
  infoModal.setAttribute('aria-hidden', 'true')
  modalBackdrop.setAttribute('aria-hidden', 'true')
  modalText.textContent = ''
  isPaused = false

  if (messageHideTimer) {
    window.clearTimeout(messageHideTimer)
    messageHideTimer = null
  }
}

if (modalClose) {
  modalClose.addEventListener('click', () => {
    hideMessageModal()
    dismissedTriggerKey = activeTriggerKey
  })
}

let lastTime = performance.now()
function animate(backgroundCanvas) {
  // Calculate delta time
  const currentTime = performance.now()
  const deltaTime = (currentTime - lastTime) / 1000
  lastTime = currentTime

  if (!isPaused) {
    // Update player position
    player.handleInput(keys)
    player.update(deltaTime, collisionBlocks)

    // Keep player inside the world bounds
    player.x = Math.max(0, Math.min(player.x, WORLD_W - player.width))
    player.y = Math.max(0, Math.min(player.y, WORLD_H - player.height))
    player.updateHitbox()

    const trigger = getTriggerAtPlayer(player)
    const triggerKey = trigger?.id ?? null

    if (!trigger) {
      activeTriggerKey = null
      dismissedTriggerKey = null
      hideMessageModal()
    } else if (activeTriggerKey !== triggerKey) {
      showMessageModal(trigger.message, triggerKey)
    } else if (dismissedTriggerKey === triggerKey) {
      hideMessageModal()
    }
  }

  // Camera (top-left of the viewport in world coords)
  camX = Math.max(0, Math.min(player.x + player.width / 2 - VIEW_W / 2, WORLD_W - VIEW_W))
  camY = Math.max(0, Math.min(player.y + player.height / 2 - VIEW_H / 2, WORLD_H - VIEW_H))

  // Render scene
  c.save()
  c.setTransform(dpr, 0, 0, dpr, 0, 0)
  c.clearRect(0, 0, VIEW_W, VIEW_H)
  c.translate(-camX, -camY)

  c.drawImage(backgroundCanvas, 0, 0)
  if (debugDrawCollisions) collisionBlocks.forEach((b) => b.draw(c))
  player.draw(c)
  c.restore()

  requestAnimationFrame(() => animate(backgroundCanvas))
}

const startRendering = async () => {
  try {
    const backgroundCanvas = await renderStaticLayers()
    if (!backgroundCanvas) {
      console.error('Failed to create the background canvas')
      return
    }

    animate(backgroundCanvas)
  } catch (error) {
    console.error('Error during rendering:', error)
  }
}

startRendering()

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect()
  const scaleX = VIEW_W / rect.width
  const scaleY = VIEW_H / rect.height
  const worldX = (event.clientX - rect.left) * scaleX + camX
  const worldY = (event.clientY - rect.top) * scaleY + camY

  const playerCenterX = player.x + player.width / 2
  const playerCenterY = player.y + player.height / 2
  const dx = worldX - playerCenterX
  const dy = worldY - playerCenterY
  const distance = Math.hypot(dx, dy)

  if (!distance) return

  const stepX = (dx / distance) * CLICK_STEP
  const stepY = (dy / distance) * CLICK_STEP

  player.moveBy(stepX, stepY, collisionBlocks)
  player.x = Math.max(0, Math.min(player.x, WORLD_W - player.width))
  player.y = Math.max(0, Math.min(player.y, WORLD_H - player.height))
  player.updateHitbox()
})

// Debug toggle for collision blocks
window.addEventListener('keydown', (e) => {
  if (e.key === 'p' || e.key === 'P') {
    debugDrawCollisions = !debugDrawCollisions
    console.log(`Collision debug: ${debugDrawCollisions ? 'ON' : 'OFF'}`)
  }
})

