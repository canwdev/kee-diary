const {
  ipcOnEventSync,
  ipcOnEventAsync
} = require('../utils/ipc-helper/ipc-helper-main')
const {
  KdbxInstance
} = require('./index')
const util = require('util')
const apiPrefix = 'ipcKdbx_'

const kInstance = new KdbxInstance()

const openDatabase = async (options) => {
  await kInstance.open(options)
  return true
}

const closeDatabase = async () => {
  await kInstance.close()
  return true
}

const saveDatabase = async () => {
  await kInstance.save()
  return true
}


const checkIsOpen = () => {
  return !!kInstance.db
}

const api = {
  openDatabase,
  closeDatabase,
  saveDatabase,
  checkIsOpen
}

const apiList = []
for (const key in api) {
  const fn = api[key]
  const eventName = apiPrefix + key
  const isAsync = util.types.isAsyncFunction(fn)
  if (isAsync) {
    ipcOnEventAsync(eventName, fn)
  } else {
    ipcOnEventSync(eventName, fn)
  }
  apiList.push({
    eventName,
    isAsync
  })
}

ipcOnEventSync('getAvailableApi', () => {
  return apiList
})
