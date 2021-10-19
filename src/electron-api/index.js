const {remote} = require('electron')
const fsUtil = require('./fs-util')
const util = require('./util')
const ipcHelper = require('@canwdev/electron-utils/ipc/ipc-helper-render')

const self = {
  ...fsUtil,
  ...util,
  ...ipcHelper
}

module.exports = self
