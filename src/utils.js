export const RATIO_OF_CHARS_MAX_FOR_WIDTH = 17

export const MAX_ITEM_LIST_NUM = 10000

export const findReactElement = node => {
  for (let key in node) {
    if (key && key.startsWith("__reactInternalInstance$")) {
      if (process.env.NODE_ENV === 'production') {
        return node[key].return
      } else {
        return node[key]._debugOwner.stateNode
      }
    }
  }
  return null;
}

export const checkNonTouchDevice = () => {
  // 1. Check modern pointer capability (Best for detecting mouse/trackpad priority)
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  // 2. Check physical touch point availability
  const hasNoTouchPoints = navigator.maxTouchPoints === 0;
  // If it has a fine pointer and reports 0 touch points, it is strictly a non-touch device
  return hasFinePointer && hasNoTouchPoints;
}