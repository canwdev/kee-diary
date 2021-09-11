const {remote} = require('electron')
const fsUtil = require('./fs-util')
const util = require('./util')
const ipcHelper = require('../utils/ipc-helper/ipc-helper-render')

const self = {
  ...fsUtil,
  ...util,
  ...ipcHelper,
  // 退出前提示
  getShowExitPrompt: remote.app.showExitPrompt,
  setShowExitPrompt: (flag = true) => {
    remote.app.showExitPrompt = flag
  }
}

module.exports = self
