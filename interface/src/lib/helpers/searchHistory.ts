export const getSearchHistory = (): [] => {
  if (!localStorage.getItem('search-history')) return []
  return JSON.parse(localStorage.getItem('search-history'))
}

export const addSearchHistory = (item: object) => {
  // console.log('addSearchHistory:', item)
  if (!item) return 
  let history = getSearchHistory()
  // console.log('history:', history)
  
  let index = history.findIndex(h => h.symbol === item.symbol);
  if (index === -1) {
    history.push(item);
  } else {
    let existingItem = history.splice(index, 1)[0];
    history.push(existingItem);
  }

  if (history.length > 6) {
    history.shift();
  }
  localStorage.setItem('search-history', JSON.stringify(history))
}