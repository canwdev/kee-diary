const {shell, remote} = require('electron')
const fetch = require('node-fetch');

const checkUrl = 'http://developers.google.cn/generate_204'
const checkUrlOrigin = 'http://developers.google.cn'

const checkConnectivity = () => {
  return new Promise((resolve) => {
    fetch(checkUrl, {
      headers: {'Origin': checkUrlOrigin},
    }).then(() => {
      resolve(true)
    }).catch(() => {
      resolve(false)
    })
  })
}

function alert(message) {
  remote.dialog.showMessageBoxSync(remote.getCurrentWindow(), {
    type: 'warning',
    message
  })
}

function showErrorBox(title, message) {
  remote.dialog.showMessageBoxSync(remote.getCurrentWindow(), {
    type: 'error',
    title, message
  })
}

module.exports = {
  openExternal: shell.openExternal,
  checkConnectivity,
  alert,
  showErrorBox
}
