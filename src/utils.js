export const RATIO_OF_CHARS_MAX_FOR_WIDTH = 17

export const MAX_ITEM_LIST_NUM = 10000

export const findReactElement = node => {
  for(let key in node) {
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