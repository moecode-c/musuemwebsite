const X_VELOCITY = 120
const Y_VELOCITY = 120
const FRAME_WIDTH = 32
const FRAME_HEIGHT = 32
const FRAME_COLS = 12
const FRAME_ROWS = 1
const FRAME_MS = 120
const HITBOX_OFFSET_X = 1
const HITBOX_OFFSET_Y = 2

class Player {
  constructor({ x, y, size, velocity = { x: 0, y: 0 } }) {
    this.x = x
    this.y = y
    this.width = size
    this.height = size
    this.velocity = velocity
    this.isImageLoaded = false
    this.image = new Image()
    this.image.src = './images/Run(32x32).png?v=1'

    this.image.onload = () => {
      this.isImageLoaded = true
    }
    this.elapsedTime = 0
    this.currentFrame = 0
    this.currentRow = 0

    this.hitbox = {
      x: 0,
      y: 0,
      width: size - (HITBOX_OFFSET_X * 2),
      height: size - HITBOX_OFFSET_Y,
    }
  }

  draw(c) {
    if (this.isImageLoaded === true) {
      const cropbox = {
        x: this.currentFrame * FRAME_WIDTH,
        y: this.currentRow * FRAME_HEIGHT,
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT,
      }

      c.drawImage(
        this.image,
        cropbox.x,
        cropbox.y,
        cropbox.width,
        cropbox.height,
        this.x,
        this.y,
        this.width,
        this.height,
      )
    }

    // Debug hitbox drawing removed.
  }

  update(deltaTime, collisionBlocks) {
    if (!deltaTime) return

    this.updateAnimation(deltaTime)

    this.updateHitbox()

    // Update horizontal position and check collisions
    this.updateHorizontalPosition(deltaTime)
    this.updateHitbox()
    this.checkForHorizontalCollisions(collisionBlocks)
    this.updateHitbox()

    // Update vertical position and check collisions
    this.updateVerticalPosition(deltaTime)
    this.updateHitbox()
    this.checkForVerticalCollisions(collisionBlocks)
    this.updateHitbox()
  }

  moveBy(dx, dy, collisionBlocks) {
    if (!dx && !dy) return

    const prevVelocityX = this.velocity.x
    const prevVelocityY = this.velocity.y

    if (dx !== 0) {
      this.velocity.x = dx
      this.x += dx
      this.updateHitbox()
      this.checkForHorizontalCollisions(collisionBlocks)
      this.updateHitbox()
    }

    if (dy !== 0) {
      this.velocity.y = dy
      this.y += dy
      this.updateHitbox()
      this.checkForVerticalCollisions(collisionBlocks)
      this.updateHitbox()
    }

    this.velocity.x = prevVelocityX
    this.velocity.y = prevVelocityY
  }

  

  updateAnimation(deltaTime) {
    if (this.isImageLoaded !== true) return

    const isMoving = this.velocity.x !== 0 || this.velocity.y !== 0
    if (!isMoving) {
      this.elapsedTime = 0
      this.currentFrame = 0
      return
    }

    this.elapsedTime += deltaTime * 1000
    if (this.elapsedTime >= FRAME_MS) {
      this.elapsedTime = 0
      this.currentFrame = (this.currentFrame + 1) % FRAME_COLS
    }

    if (FRAME_ROWS > 1 && this.velocity.y < 0) {
      this.currentRow = 1
    } else {
      this.currentRow = 0
    }
  }

  updateHorizontalPosition(deltaTime) {
    this.x += this.velocity.x * deltaTime
  }

  updateVerticalPosition(deltaTime) {
    this.y += this.velocity.y * deltaTime
  }

  updateHitbox() {
    this.hitbox.x = this.x + HITBOX_OFFSET_X
    this.hitbox.y = this.y + HITBOX_OFFSET_Y
  }

  handleInput(keys) {
    this.velocity.x = 0
    this.velocity.y = 0

    if (keys.d.pressed) {
      this.velocity.x = X_VELOCITY
    }
    if (keys.a.pressed) {
      this.velocity.x = -X_VELOCITY
    }
    if (keys.w.pressed) {
      this.velocity.y = -Y_VELOCITY
    }
    if (keys.s.pressed) {
      this.velocity.y = Y_VELOCITY
    }
  }

  checkForHorizontalCollisions(collisionBlocks) {
    const buffer = 0.0001
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i]

      // Check if a collision exists on all axes
      if (
        this.hitbox.x <= collisionBlock.x + collisionBlock.width &&
        this.hitbox.x + this.hitbox.width >= collisionBlock.x &&
        this.hitbox.y + this.hitbox.height >= collisionBlock.y &&
        this.hitbox.y <= collisionBlock.y + collisionBlock.height
      ) {
        // Check collision while player is going left
        if (this.velocity.x < -0) {
          this.x = collisionBlock.x + collisionBlock.width + buffer - HITBOX_OFFSET_X
          break
        }

        // Check collision while player is going right
        if (this.velocity.x > 0) {
          this.x = collisionBlock.x - this.hitbox.width - buffer - HITBOX_OFFSET_X

          break
        }
      }
    }
  }

  checkForVerticalCollisions(collisionBlocks) {
    const buffer = 0.0001
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i]

      // If a collision exists
      if (
        this.hitbox.x <= collisionBlock.x + collisionBlock.width &&
        this.hitbox.x + this.hitbox.width >= collisionBlock.x &&
        this.hitbox.y + this.hitbox.height >= collisionBlock.y &&
        this.hitbox.y <= collisionBlock.y + collisionBlock.height
      ) {
        // Check collision while player is going up
        if (this.velocity.y < 0) {
          this.velocity.y = 0
          this.y = collisionBlock.y + collisionBlock.height + buffer - HITBOX_OFFSET_Y
          break
        }

        // Check collision while player is going down
        if (this.velocity.y > 0) {
          this.velocity.y = 0
          this.y = collisionBlock.y - this.hitbox.height - buffer - HITBOX_OFFSET_Y
          break
        }
      }
    }
  }
}