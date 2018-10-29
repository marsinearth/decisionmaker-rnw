export const NUM_OF_CHARS_IN_ONE_LINE_FOR_TEXT_INPUT: number = 22

export const MAX_ITEM_LIST_NUM: number = 1000

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