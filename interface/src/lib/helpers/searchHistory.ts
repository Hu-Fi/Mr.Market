export const getSearchHistory = (): any[] => {
  const history = localStorage.getItem('search-history');
  if (!history) return []
  return JSON.parse(history)
}

export const addSearchHistory = (item: any) => {
  // console.log('addSearchHistory:', item)
  if (!item) return
  const history = getSearchHistory()
  // console.log('history:', history)

  const index = history.findIndex((h: any) => h.symbol === item.symbol);
  if (index === -1) {
    history.push(item);
  } else {
    const existingItem = history.splice(index, 1)[0];
    history.push(existingItem);
  }

  if (history.length > 6) {
    history.shift();
  }
  localStorage.setItem('search-history', JSON.stringify(history))
}