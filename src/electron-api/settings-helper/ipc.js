const settings = require('electron-settings')
const {
  ipcOnEventSync,
  ipcOnEventAsync
} = require('@canwdev/electron-utils/ipc/ipc-helper-main')
const settingsEnum = require('./enum')

ipcOnEventSync(settingsEnum.IPC_SETTINGS_ACTION, (args = {}) => {
  const {action, params = []} = args
  if (!action) {
    throw new Error('action can not be empty')
  }
  return (typeof settings[action] === 'function')
    ? settings[action](...params) : settings[action]
})

module.exports = settingsEnum
