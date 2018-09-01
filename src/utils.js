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