const {remote} = require('electron')
const fsUtil = require('./fs-util')
const util = require('./util')
const ipcHelper = require('@canwdev/electron-utils/ipc/ipc-helper-render')
const wmPreload = require('@canwdev/electron-window-manager/preload')

const self = {
  ...fsUtil,
  ...util,
  ...ipcHelper,
  ...wmPreload
}

module.exports = self
