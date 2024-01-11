export const getSearchHistory = (): [] => {
  if (!localStorage.getItem('search-history')) return []
  return JSON.parse(localStorage.getItem('search-history'))
}

export const addSearchHistory = (item: object) => {
  // console.log('addSearchHistory:', item)
  if (!item) return 
  let history = getSearchHistory()
  // console.log('history:', history)
  
  if (history.length > 6) {
    history.shift();
  }
  
  let existingItem = history.find(h => h.symbol === item.symbol);
  if (!existingItem) {
    history.push(item);
  } else {
    history = history.filter(h => h.symbol !== item.symbol);
    history.push(item)
  }
  localStorage.setItem('search-history', JSON.stringify(history))
}