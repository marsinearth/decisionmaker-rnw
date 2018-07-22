export const findReactElement = node => {
  for(let key in node) {
    if (key && key.startsWith("__reactInternalInstance$")) {
      return node[key]._debugOwner.stateNode      
    }
  }
  return null;
}