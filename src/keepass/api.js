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

const getMeta = () => {
  return {
    // header: kInstance.db.header,
    meta: kInstance.db.meta
  }
}

const getGroupTree = async (groupUuid) => {
  return kInstance.getGroupTree(groupUuid)
}

const getGroupEntries = async (groupUuid) => {
  return kInstance.getGroupEntries(groupUuid)
}

const getEntryDetail = async (uuid) => {
  return kInstance.getEntryDetail(uuid)
}

const updateEntry = async (uuid, update) => {
  return kInstance.updateEntry(uuid, update)
}

const api = {
  openDatabase,
  closeDatabase,
  saveDatabase,
  checkIsOpen,
  getMeta,
  getGroupTree,
  getGroupEntries,
  getEntryDetail,
  updateEntry
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
