const {shell, remote, ipcRenderer, contextBridge} = require('electron')
const fs = remote.require('fs')

const electronAPI = function () {

  // 外部浏览器打开链接
  this.openExternal = shell.openExternal
  // 打开文件选择器
  this.openFileChooser = function (filters = []) {
    return remote.dialog.showOpenDialogSync(remote.getCurrentWindow(), {
      properties: ['openFile'],
      filters: filters
    })
  }

  // fs
  this.readFileSyncAsArrayBuffer = function (path) {
    let res
    try {
      const file = fs.readFileSync(path)
      res = new Uint8Array(file).buffer
    } catch (e) {
      alert(e)
      console.error(e)
      throw new Error(e)
    }

    return res
  }

  this.saveFileSyncAsArrayBuffer = function (path, arrayBuffer) {
    let res
    try {
      res = fs.writeFileSync(path, Buffer.from(arrayBuffer))
    } catch (e) {
      // alert(e)
      console.error(e)
      throw new Error(e)
    }
    return res
  }

  this.readFileSyncAsPlainText = function (path) {
    return fs.readFileSync(path, {encoding:'utf8'})
  }

  this.showErrorBox = function (title, message) {
    remote.dialog.showMessageBoxSync(remote.getCurrentWindow(), {
      type: 'error',
      title, message
    })
  }

  this.alert = function (message) {
    remote.dialog.showMessageBoxSync(remote.getCurrentWindow(), {
      type: 'warning',
      message
    })
  }

  // 退出前提示
  this.getShowExitPrompt = remote.app.showExitPrompt
  this.setShowExitPrompt = (flag = true) => remote.app.showExitPrompt = flag

  // this.getIpcRender = () => ipcRenderer

  this.sendMessage = (channel, data) => {
    // whitelist channels
    let validChannels = ["toMain"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  }

  let validReceiveChannels = ['app-closing'];
  this.onMessage = (channel, func) => {
    if (validReceiveChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, func);
    }
  }
  this.offMessage = (channel, func) => {
    if (validReceiveChannels.includes(channel)) {
      // need test
      ipcRenderer.off(channel, func);
    }
  }
}

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded')
  // window.electronAPI = new electronAPI()
})

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  "electronAPI", new electronAPI()
);
