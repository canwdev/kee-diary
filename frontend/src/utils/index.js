export function pad2Num(num, len = 2) {
  return num.toString().padStart(len, '0')
}

export function formatDate(date, isSecond) {
  const year = date.getFullYear() + '-'
  const month = pad2Num(date.getMonth() + 1) + '-'
  const day = pad2Num(date.getDate())
  const hours = ' ' + pad2Num(date.getHours()) + ':'
  const minutes = pad2Num(date.getMinutes())
  const seconds = isSecond ? (':' + pad2Num(date.getSeconds())) : ''
  return [year, month, day, hours, minutes, seconds].join('')
}

export function formatDateLite(d) {
  // let time = pad2Num(d.getHours()) + ':' + pad2Num(d.getMinutes())
  return d.toISOString().substr(0, 10)
}

export const notifySuccess = (message = 'Success', caption) => {
  alert(message)
  // Notify.create({
  //   message: message,
  //   caption: caption,
  //   color: 'positive',
  //   position: 'top',
  //   icon: 'done',
  //   timeout: 1500
  // })
}

export const notifyError = (message = 'Error', caption) => {
  alert(message)
  // Notify.create({
  //   message: message,
  //   caption: caption,
  //   color: 'negative',
  //   position: 'top',
  //   icon: 'warning',
  //   timeout: 2000
  // })
}
