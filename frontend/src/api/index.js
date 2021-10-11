const {electronAPI} = window
const {
  ipcSendEventSync,
  ipcSendEventAsync
} = electronAPI
import mainBus, {BUS_SYNC_ENTRY_DETAIL} from '@/utils/bus'
import store from '@/store'
import router from '@/router'
import main from '@/main'
import i18n from '@/lang/i18n'

const callSync = (name, data) => {
  try {
    return ipcSendEventSync('ipcKdbx_' + name, data)
  } catch (e) {
    main.$toast.error(e)
    throw e
  }
}

const callAsync = async (name, data) => {
  try {
    return await ipcSendEventAsync('ipcKdbx_' + name, data)
  } catch (e) {
    main.$toast.error({
      message: e
    })
    throw e
  }
}

export function openDatabase(data) {
  return callAsync('openDatabase', data)
}

export function closeDatabase() {
  return callAsync('closeDatabase')
}

export function saveDatabase() {
  return callAsync('saveDatabase')
}

export function checkIsOpen() {
  return callSync('checkIsOpen')
}

export function getIsChanged() {
  return callSync('getIsChanged')
}

export function getGroupTree(groupUuid) {
  return callAsync('getGroupTree', groupUuid)
}

export function getGroupEntries(groupUuid) {
  return callAsync('getGroupEntries', groupUuid)
}

export function getEntryDetail(uuid) {
  return callAsync('getEntryDetail', uuid)
}

export function updateEntry(params) {
  return callAsync('updateEntry', params)
}

export function updateGroup(params) {
  return callAsync('updateGroup', params)
}

export function createEntry(params) {
  return callAsync('createEntry', params)
}

export function createGroup(params) {
  return callAsync('createGroup', params)
}

export function removeGroup(params) {
  return callAsync('removeGroup', params)
}

export function moveGroup(params) {
  return callAsync('moveGroup', params)
}

export function moveItems(params) {
  return callAsync('moveItems', params)
}

// ====== custom frontend api ======

export function getNodeUuid(node) {
  if (node && node.data && node.data.uuid) {
    return node.data.uuid
  }
}

export async function handleSaveDatabase() {
  const saveDb = async () => {
    await saveDatabase()
    store.commit('setIsChanged', false)
    main.$toast.success(i18n.t('kdbx.saved-successfully'))
  }
  try {
    store.commit('setIsGlobalLoading', true)
    if (router.currentRoute.name !== 'Detail') {
      await saveDb()
      return
    }
    mainBus.$emit(BUS_SYNC_ENTRY_DETAIL, async () => {
      console.log('sync complete')
      await saveDb()
    })
  } catch (e) {
    console.error(e)
    main.$toast.error(e)
  } finally {
    store.commit('setIsGlobalLoading', false)
  }
}

export async function handleCloseDatabase() {
  await closeDatabase()

  store.commit('setIsUnlocked', false)
  store.commit('setIsChanged', false)
  store.commit('setSelectedGroup', null)

}
