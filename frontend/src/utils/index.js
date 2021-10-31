export function pad2Num(num, len = 2) {
  return num.toString().padStart(len, '0')
}

export function formatDate(date) {
  if (!date) {
    return ''
  }
  const year = date.getFullYear() + '-'
  const month = pad2Num(date.getMonth() + 1) + '-'
  const day = pad2Num(date.getDate())
  const hours = ' ' + pad2Num(date.getHours()) + ':'
  const minutes = pad2Num(date.getMinutes())
  return [year, month, day, hours, minutes].join('')
}
