const {electronAPI} = window
const {
  ipcSendEventSync,
  ipcSendEventAsync
} = electronAPI
import mainBus, {BUS_SYNC_ENTRY_DETAIL} from '@/utils/bus'

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

export function getGroupTree(groupUuid) {
  return ipcSendEventAsync('ipcKdbx_getGroupTree', groupUuid)
}

export function getGroupEntries(groupUuid) {
  return ipcSendEventAsync('ipcKdbx_getGroupEntries', groupUuid)
}

export function getEntryDetail(uuid) {
  return ipcSendEventAsync('ipcKdbx_getEntryDetail', uuid)
}

export function getNodeUuid(node) {
  if (node && node.data && node.data.uuid) {
    return node.data.uuid
  }
}

export function handleSaveDatabase() {
  mainBus.$emit(BUS_SYNC_ENTRY_DETAIL, () => {
    console.log('sync complete')
  })
}
