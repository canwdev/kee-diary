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

const getIsChanged = () => {
  return !!kInstance.isChanged
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

const updateEntry = async (params) => {
  return kInstance.updateEntry(params)
}

const createEntry = async (params) => {
  return kInstance.createEntry(params)
}

const createGroup = async (params) => {
  return kInstance.createGroup(params)
}

const removeGroup = async (params) => {
  const {groupUuid} = params || {}
  const group = kInstance.db.getGroup(groupUuid)
  return kInstance.removeItems(group)
}

const moveItems = async (params) => {
  return kInstance.moveItems(params)
}

const api = {
  openDatabase,
  closeDatabase,
  saveDatabase,
  checkIsOpen,
  getIsChanged,
  getMeta,
  getGroupTree,
  getGroupEntries,
  getEntryDetail,
  updateEntry,
  createEntry,
  createGroup,
  removeGroup,
  moveItems,
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

module.exports = {
  kInstance
}
