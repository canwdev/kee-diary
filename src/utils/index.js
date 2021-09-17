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

/**
 * 安全地获取嵌套对象的值
 * @param obj 对象
 * @param path 键值数组
 * @param fallback 获取失败的返回值
 */
function getVal(obj, path, fallback) {
  try {
    let i
    const len = path.length
    for (i = 0; typeof obj === 'object' && i < len; ++i) {
      obj = obj[path[i]]
    }
    return obj || fallback
  } catch (e) {
    return fallback
  }
}

function getValDot(obj, strPath, fallback) {
  const path = strPath.split('.')
  return getVal(obj, path, fallback)
}

function setVal(obj, path, val) {
  let i
  const len = path.length - 1
  for (i = 0; typeof obj === 'object' && i < len; ++i) {
    obj = obj[path[i]]
  }

  if (obj instanceof Map) {
    obj.set(path[len], val)
  } else {
    obj[path[len]] = val
  }
}

function setValDot(obj, strPath, val) {
  const path = strPath.split('.')
  return setVal(obj, path, val)
}

module.exports = {
  isElectionDevMode,
  readFileAsArrayBuffer,
  saveFileFromArrayBuffer,
  getVal,
  getValDot,
  setVal,
  setValDot,
}
