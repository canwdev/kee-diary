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

export function openDatabase(data) {
  return ipcSendEventAsync('ipcKdbx_openDatabase', data)
}

export function closeDatabase() {
  return ipcSendEventAsync('ipcKdbx_closeDatabase')
}

export function saveDatabase() {
  return ipcSendEventAsync('ipcKdbx_saveDatabase')
}

export function checkIsOpen() {
  return ipcSendEventSync('ipcKdbx_checkIsOpen')
}

export function getIsChanged() {
  return ipcSendEventSync('ipcKdbx_getIsChanged')
}

export function getGroupTree(groupUuid) {
  return ipcSendEventAsync('ipcKdbx_getGroupTree', groupUuid)
}

export function getGroupEntries(groupUuid) {
  return ipcSendEventAsync('ipcKdbx_getGroupEntries', groupUuid)
}

export function getEntryDetail(uuid) {
  return ipcSendEventAsync('ipcKdbx_getEntryDetail', uuid)
}

export function updateEntry(params) {
  return ipcSendEventAsync('ipcKdbx_updateEntry', params)
}

export function addEntry(params) {
  return ipcSendEventAsync('ipcKdbx_addEntry', params)
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
