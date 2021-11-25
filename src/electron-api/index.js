const fsUtil = require('./fs-util')
const util = require('./util')
const ipcHelper = require('@canwdev/electron-utils/ipc/ipc-helper-render')
const settingsHelper = require('./settings-helper/preload')
const wmPreload = require('./wm-preload')

const self = {
  ...fsUtil,
  ...util,
  ...ipcHelper,
  ...wmPreload,
  ...settingsHelper,
}

module.exports = self
