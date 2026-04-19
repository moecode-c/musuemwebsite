window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w':
    case 'ArrowUp':
      keys.w.pressed = true
      break
    case 'a':
    case 'ArrowLeft':
      keys.a.pressed = true
      break
    case 's':
    case 'ArrowDown':
      keys.s.pressed = true
      break
    case 'd':
    case 'ArrowRight':
      keys.d.pressed = true
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'w':
    case 'ArrowUp':
      keys.w.pressed = false
      break
    case 'a':
    case 'ArrowLeft':
      keys.a.pressed = false
      break
    case 's':
    case 'ArrowDown':
      keys.s.pressed = false
      break
    case 'd':
    case 'ArrowRight':
      keys.d.pressed = false
      break
  }
})

// On return to game's tab, ensure delta time is reset
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    lastTime = performance.now()
  }
})