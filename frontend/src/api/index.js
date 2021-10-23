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

const saveDb = async () => {
  await saveDatabase()
  store.commit('setIsChanged', false)
  main.$toast.success(i18n.t('kdbx.saved-successfully'))
}

export async function handleSaveDatabase() {
  try {
    if (!store.state.isChanged || !store.state.isUnlocked) {
      return
    }
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

async function doCloseDatabase() {
  await closeDatabase()

  store.commit('setIsUnlocked', false)
  store.commit('setIsChanged', false)
  store.commit('setSelectedGroup', null)
  await router.replace({
    name: 'Login'
  })
}

export async function handleCloseDatabase() {
  if (!store.state.isUnlocked) {
    return
  }
  if (!store.state.isChanged) {
    await doCloseDatabase()
    return
  }
  main.$prompt.create({
    propsData: {
      title: 'Confirm Lock',
      content: 'Do you want to save database?',
      btnConfirm: null,
      btnCancel: null,
      multipleActions: [
        {label: 'Save and Lock', value: 1},
        {label: 'Don\'t Save', value: 2},
        {label: 'Cancel', value: 3},
      ]
    }
  }).onAction((context, val) => {
    if (val === 1) {
      handleSaveDatabase().then(() => {
        doCloseDatabase()
      })
    } else if (val === 2) {
      doCloseDatabase()
    } else if (val === 3) {
      console.log('cancel')
    }
  })
}
