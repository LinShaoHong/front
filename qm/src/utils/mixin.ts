export const deviceResizeSupporter = (fn: Function) => {
  window.addEventListener('resize', (e: Event) => {
    fn()
  }, false)
}
