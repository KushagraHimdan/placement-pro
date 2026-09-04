// Smoothly scrolls to a section over a set duration, then lets the real anchor jump
// complete natively — so the URL, back-button, and deep-linking all still work normally.
export const smoothScrollTo = (e, id, duration = 200) => {
  const target = document.getElementById(id)
  if (!target) return

  e.preventDefault()

  const startY = window.scrollY
  const targetY = target.getBoundingClientRect().top + startY - 80
  const distance = targetY - startY
  const startTime = performance.now()

  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

  const step = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, startY + distance * easeInOutCubic(progress))
    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      // once the animation finishes, update the URL hash the normal way (native browser behavior)
      window.history.pushState(null, '', `#${id}`)
    }
  }

  requestAnimationFrame(step)
}