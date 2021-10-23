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

const API_PREFIX = 'ipcKdbx_'

const callSync = (name, data) => {
  try {
    return ipcSendEventSync(API_PREFIX + name, data)
  } catch (e) {
    main.$toast.error(e)
    throw e
  }
}

const callAsync = async (name, data) => {
  try {
    return await ipcSendEventAsync(API_PREFIX + name, data)
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

export function getMeta() {
  return callSync('getMeta')
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

export const closeWindow = () => {
  window.electronAPI.closeWindow()
}

export async function handleCloseDatabase({isExit = false} = {}) {
  if (!store.state.isUnlocked) {
    return
  }
  if (!store.state.isChanged) {
    await doCloseDatabase()
    return
  }
  const andExit = isExit ? i18n.t('and-exit') : ''

  main.$prompt.create({
    propsData: {
      title: i18n.t('confirm') + ' ' + (isExit ? i18n.t('exit') : i18n.t('header.lock')),
      content: i18n.t('kdbx.there-are-unsaved'),
      btnConfirm: null,
      btnCancel: null,
      multipleActions: [
        {label: i18n.t('save') + andExit, value: 1},
        {label: i18n.t('don-t-save') + andExit, value: 2},
        {label: i18n.t('cancel'), value: 3},
      ]
    }
  }).onAction((context, val) => {
    if (val === 1) {
      handleSaveDatabase().then(() => {
        doCloseDatabase()
        isExit && closeWindow()
      })
    } else if (val === 2) {
      doCloseDatabase()
      isExit && closeWindow()
    } else if (val === 3) {
      console.log('cancel')
    }
  })
}

export function getRecycleText(uuid) {
  const {meta} = getMeta()
  const rUuid = meta.recycleBinUuid && meta.recycleBinUuid.id

  let text
  if (rUuid === uuid) {
    text = i18n.t('menu.empty-recycle-bin')
  } else if (meta.recycleBinEnabled) {
    text = i18n.t('menu.move-to-recycle-bin')
  } else {
    text = i18n.t('delete')
  }
  return text
}
