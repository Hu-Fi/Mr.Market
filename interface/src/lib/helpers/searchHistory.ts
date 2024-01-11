export const getSearchHistory = (): [] => {
  if (!localStorage.getItem('search-history')) return []
  return JSON.parse(localStorage.getItem('search-history'))
}

export const addSearchHistory = (item: object) => {
  console.log('addSearchHistory:', item)
  if (!item) return 
  const history = getSearchHistory()
  console.log('history:', history)
  
  if (history.length >= 6) {
    history.pop();
  }
  history.push(item)
  localStorage.setItem('search-history', JSON.stringify(history))
}