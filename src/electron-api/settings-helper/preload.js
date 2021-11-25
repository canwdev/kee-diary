const {
  ipcSendEventSync
} = require('@canwdev/electron-utils/ipc/ipc-helper-render')
const settingsEnum = require('./enum')

module.exports = {
  settingsGet(key) {
    return ipcSendEventSync(settingsEnum.IPC_SETTINGS_ACTION, {
      action: 'getSync',
      params: [key]
    })
  },
  settingsSet(key, val) {
    return ipcSendEventSync(settingsEnum.IPC_SETTINGS_ACTION, {
      action: 'setSync',
      params: [key, val]
    })
  },
  settingsUnset() {
    return ipcSendEventSync(settingsEnum.IPC_SETTINGS_ACTION, {
      action: 'unsetSync',
    })
  },
  settingsEnum
}
