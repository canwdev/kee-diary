const {shell, remote, ipcRenderer, contextBridge} = require('electron')
const fs = remote.require('fs')

const electronAPI = function () {

  // 外部浏览器打开链接
  this.openExternal = shell.openExternal

  // 打开文件选择器
  this.openFileChooser = function (config = {}) {
    return new Promise(async (resolve, reject) => {
      const {
        filters = [], // [{name: '*.kdbx file', extensions: ['kdbx']}]
        sizeLimit = 0 // Byte
      } = config
      const resOpen = await remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ['openFile'],
        filters: filters
      })
      if (resOpen.canceled) {
        return resolve([])
      }
      const {filePaths: files} = resOpen
      if (!files) {
        return resolve([])
      }

      if (sizeLimit > 0) {
        const allSize = files.reduce((pv, cv) => {
          return pv + fs.statSync(cv).size
        }, 0)
        if (allSize > sizeLimit) {
          throw new Error(`File size cannot exceed ${(sizeLimit / 1024).toFixed(2)} KB, current size: ${(allSize / 1024).toFixed(2)} KB`)
        }
      }

      return resolve(files)
    })
  }

  this.saveAsFile = function (text, options = {}) {
    return new Promise(async (resolve, reject) => {
      const {
        title,
        defaultPath,
        buttonLabel,
        filters
      } = options

      const saveRes = await remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
        title,
        defaultPath,
        buttonLabel,
        filters
      })
      if (saveRes.canceled) {
        return resolve(false)
      }
      const {filePath:savePath} = saveRes
      if (!savePath) {
        return reject(new Error('savePath is undefined'))
      }

      fs.writeFile(savePath, text, {
        encoding: 'utf-8'
      }, (err => {
        if (err) {
          return reject(err)
        }
        return resolve(true)
      }));

      // fs.exists(savePath, async exists => {
      //
      //   if (exists) {
      //     const result = await remote.dialog.showMessageBox(remote.getCurrentWindow(), {
      //       buttons: ["Yes","No"],
      //       message: "The file already exists, do you want to overwrite it?"
      //     })
      //     if (result === 1) {
      //       return resolve(false)
      //     }
      //   }
      //
      // })

    })


  }

  // fs
  this.readFileSyncAsArrayBuffer = function (path) {
    const file = fs.readFileSync(path)
    return new Uint8Array(file).buffer
  }

  this.saveFileSyncAsArrayBuffer = function (path, arrayBuffer) {
    return fs.writeFileSync(path, Buffer.from(arrayBuffer))
  }

  this.readFileAsPlainText = function (path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
        if (err) {
          reject(err)
        }
        resolve(data)
      })
    })
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
