const remote = require('@electron/remote')
const fs = require('fs')

// 打开文件选择器
function showFileChooser(config = {}) {
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

function showSaveDialog(text, options = {}) {
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
    const {filePath: savePath} = saveRes
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

function readFileAsPlainText(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

module.exports = {
  showFileChooser,
  showSaveDialog,
  readFileAsPlainText
}
