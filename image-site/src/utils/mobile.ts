export const slider = (element: Node, prevent: boolean, handler: (relativeX: number, relativeY: number) => void) => {
  let startX, startY
  element.addEventListener('touchstart', (e: TouchEvent) => {
    if (prevent) {
      e.preventDefault()
    }
    startX = e.touches[0].pageX
    startY = e.touches[0].pageY
  })

  element.addEventListener('touchend', (e: TouchEvent) => {
    if (prevent) {
      e.preventDefault()
    }
    const moveEndX = e.changedTouches[0].pageX
    const moveEndY = e.changedTouches[0].pageY

    const x = moveEndX - startX
    const y = moveEndY - startY

    handler(x, y)
  })
}
