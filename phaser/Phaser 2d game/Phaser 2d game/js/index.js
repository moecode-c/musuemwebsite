const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const dpr = window.devicePixelRatio || 1

const VIEW_W = 1024
const VIEW_H = 576
const TILE_SIZE = 16

// Map dimensions (rows x cols)
// Derive from the exported layer data so collisions match what is rendered.
const MAP_ROWS = Array.isArray(l_terrain) ? l_terrain.length : 0
const MAP_COLS = Array.isArray(l_terrain?.[0]) ? l_terrain[0].length : 0

canvas.width = VIEW_W * dpr
canvas.height = VIEW_H * dpr

const normalizeLayer = (layer, rows, cols) =>
  Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => layer?.[y]?.[x] ?? 0),
  )

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
  const hasCollisionMap =
    typeof collisions !== 'undefined' &&
    Array.isArray(collisions) &&
    collisions.length === WORLD_ROWS &&
    Array.isArray(collisions[0]) &&
    collisions[0].length === WORLD_COLS

  if (hasCollisionMap) {
    markSolidsFromGrid(collisions)
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

let lastTime = performance.now()
function animate(backgroundCanvas) {
  // Calculate delta time
  const currentTime = performance.now()
  const deltaTime = (currentTime - lastTime) / 1000
  lastTime = currentTime

  // Update player position
  player.handleInput(keys)
  player.update(deltaTime, collisionBlocks)

  // Keep player inside the world bounds
  player.x = Math.max(0, Math.min(player.x, WORLD_W - player.width))
  player.y = Math.max(0, Math.min(player.y, WORLD_H - player.height))

  // Camera (top-left of the viewport in world coords)
  const camX = Math.max(0, Math.min(player.x + player.width / 2 - VIEW_W / 2, WORLD_W - VIEW_W))
  const camY = Math.max(0, Math.min(player.y + player.height / 2 - VIEW_H / 2, WORLD_H - VIEW_H))

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

// Debug toggle for collision blocks
window.addEventListener('keydown', (e) => {
  if (e.key === 'p' || e.key === 'P') {
    debugDrawCollisions = !debugDrawCollisions
    console.log(`Collision debug: ${debugDrawCollisions ? 'ON' : 'OFF'}`)
  }
})

