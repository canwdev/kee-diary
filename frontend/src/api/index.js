const {electronAPI} = window
const {
  ipcSendEventSync,
  ipcSendEventAsync
} = electronAPI

export function openDatabase(data) {
  return ipcSendEventAsync('ipcKdbx_openDatabase', data)
}

export function closeDatabase() {
  return ipcSendEventAsync('ipcKdbx_closeDatabase')
}

export function saveDatabase() {
  return ipcSendEventAsync('ipcKdbx_saveDatabase')
}

export function checkIsOpen() {
  return ipcSendEventSync('ipcKdbx_checkIsOpen')
}
