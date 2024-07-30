/**
 * 滑动相关
 */

export function useTouch() {
  const startX = ref(0);
  const startY = ref(0);
  const endX = ref(0);
  const endY = ref(0);

  const touchStart = (e) => {
    if (e.touches.length == 1) {
      startX.value = e.touches[0].clientX;
      startY.value = e.touches[0].clientY;
    }
  };

  const touchEnd = (e) => {
    if (e.changedTouches.length == 1) {
      endX.value = e.changedTouches[0].clientX;
      endY.value = e.changedTouches[0].clientY;
    }
  };

  return {
    startX,
    startY,
    endX,
    endY,
    touchStart,
    touchEnd
  }
}