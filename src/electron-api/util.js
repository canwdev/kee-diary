const {shell, remote} = require('electron')

const checkConnectivity = () => {
  const url = 'http://developers.google.cn/generate_204'
  const origin = 'http://developers.google.cn'
  const fetch = require('node-fetch');
  return new Promise((resolve) => {
    fetch(url, {
      headers: {'Origin': origin},
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
