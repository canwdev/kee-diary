const fs = require('fs-extra')

function isElectionDevMode() {
  const electron = require('electron');

  const app = electron.app || electron.remote.app;

  const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
  const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

  return isEnvSet ? getFromEnv : !app.isPackaged;
}

async function readFileAsArrayBuffer(path) {
  const file = fs.readFileSync(path)
  return new Uint8Array(file).buffer
}

async function saveFileFromArrayBuffer(path, arrayBuffer) {
  await fs.writeFile(path, Buffer.from(arrayBuffer))
}

module.exports = {
  isElectionDevMode,
  readFileAsArrayBuffer,
  saveFileFromArrayBuffer
}
