import kdbxweb from 'kdbxweb'
import store from '@/store'
import router from '@/router'

import {notifyError, notifySuccess} from '@/utils'
import {busEmitSaveNotes} from './bus'
import {formatDate} from '@/utils/index'

import i18n from '@/lang/i18n'

export function doCloseKdbx() {
  store.commit('setCloseDatabase')
  router.replace({
    name: 'Login'
  })
}

export function closeKdbx(isExit = false) {
  const isNotSave = store.getters.isNotSave
  if (isNotSave) {
    const andExit = isExit ? i18n.t('and-exit') : ''

    alert('TODO: Dialog')
    // TODO: Dialog
    /*Dialog.create({
      title: i18n.t('confirm') + ' ' + (isExit ? i18n.t('exit') : i18n.t('close')),
      message: i18n.t('kdbx.there-are-unsaved'),
      persistent: false,
      options: {
        type: 'radio',
        model: true,
        // inline: true,
        items: [
          {label: i18n.t('save') + andExit, value: true, color: 'positive'},
          {label: i18n.t('don-t-save') + andExit, value: false, color: 'negative'},
        ]
      },
      ok: {
        label: i18n.t('confirm')
      },
      cancel: {
        flat: true,
        label: i18n.t('cancel')
      },

    }).onOk((result) => {
      if (result) {
        saveKdbx().then(() => {
          doCloseKdbx()
          isExit && window.close()
        })
      } else {
        doCloseKdbx()
        isExit && window.close()
      }
    }).onCancel(() => {
    }).onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })*/

    return
  }
  doCloseKdbx()
  isExit && window.close()
}

function doSaveKdbx(dbPath, db) {
  return new Promise((resolve, reject) => {
    if (dbPath && db) {
      const electronAPI = window.electronAPI

      store.commit('setIsGlobalLoading')
      db.save().then(dataAsArrayBuffer => {
        try {
          electronAPI.saveFileSyncAsArrayBuffer(dbPath, dataAsArrayBuffer)
          store.commit('setIsNotSave', false)
          notifySuccess(i18n.t('kdbx.saved-successfully'))
          return resolve()
        } catch (e) {
          notifyError(e)
          return reject(e)
        }
      }).finally(() => {
        store.commit('setIsGlobalLoading', false)
      })
    } else {
      const errMsg = i18n.t('kdbx.database-not-exist')
      notifyError(errMsg)
      return reject(errMsg)
    }
  })
}

export function saveKdbx() {
  const dbPath = store.getters.dbPath
  const db = store.getters.database
  const isEntryOpen = store.getters.isEntryOpen
  const isGlobalLoading = store.getters.isGlobalLoading
  const isNotSave = store.getters.isNotSave

  if (isGlobalLoading || !isNotSave) {
    return
  }

  if (isEntryOpen) {
    return busEmitSaveNotes().then(() => {
      return doSaveKdbx(dbPath, db)
    })
  }
  return doSaveKdbx(dbPath, db)
}

/**
 * 递归遍历数据库 groups
 * usage: getGroupTree(db.groups)
 * return: customized group list
 */
export function getGroupTree(node, counter = 0) {
  const list = []
  if (!node || node.length === 0) return list

  node.forEach((group) => {
    const children = group.groups

    list.push({
      iconIndex: group.icon,
      uuid: group.uuid,
      title: group.name,
      index: counter,
      children: getGroupTree(children, counter + 1),
      id: group.uuid.id,
      _origin: group
    })
  })
  return list
}

/**
 * 获取某群组的条目列表
 * @param db 数据库实例
 * @param groupUuid 群组 Uuid 对象，而不是字符串
 * @return {[]}
 */
export function getGroupEntries(db, groupUuid) {
  const list = []
  if (db && groupUuid) {
    const group = db.getGroup(groupUuid)
    // console.log('getGroup', group)

    if (group) {
      for (let i = group.entries.length - 1; i >= 0; i--) {
        const entry = group.entries[i]
        list.push({
          id: entry.uuid.id,
          uuid: entry.uuid,
          iconIndex: entry.icon,
          title: entry.fields.Title,
          url: entry.fields.URL,
          bgColor: entry.bgColor,
          fgColor: entry.fgColor,
          creationTime: entry.times.creationTime,
          lastModTime: entry.times.lastModTime,
          _origin: entry
        })
      }
    }
  }
  // console.log('getGroupEntries', list)

  return list
}

/**
 * 向群组内添加群组
 * @param db 数据库实例
 * @param groupUuid 群组 Uuid 对象
 * @param name 名字
 * @returns {boolean} 操作成功
 */
export function addGroup(db, groupUuid, name = formatDate(new Date(), true)) {
  try {
    const group = db.getGroup(groupUuid)

    db.createGroup(group, name)
    store.commit('setIsNotSave')

    return true
  } catch (e) {
    notifyError(e.message)
    console.error(e)
    return false
  }
}

/**
 * 向群组内添加条目
 * @param db 数据库实例
 * @param groupUuid 群组 Uuid 对象
 * @returns {boolean} 操作成功
 */
export function addEntry(db, groupUuid, config = {}) {
  try {
    const {
      title,
      icon,
      bgColor,
      fgColor
    } = config
    const group = db.getGroup(groupUuid)
    const entry = db.createEntry(group)
    // console.log(db, group)

    entry.fields.Title = title || formatDate(new Date(), true)
    // 48 is default folder icon, 0 is default entry icon
    entry.icon = icon === undefined ? (group.icon === 48 ? 0 : group.icon) : icon

    if (bgColor) {
      entry.bgColor = bgColor
    }
    if (fgColor) {
      entry.fgColor = fgColor
    }

    // console.log(entry)

    store.commit('setSelectedGroup', group.uuid)
    store.commit('setCurrentEntry', entry)
    store.commit('setIsNotSave')

    return true
  } catch (e) {
    notifyError(e.message)
    console.error(e)
    return false
  }
}

/**
 * 删除多条(条目||群组)，如果有回收站则移动至回收站
 * @param db 数据库实例
 * @param items (条目||群组)对象数组
 * @return {boolean} 操作成功
 */
export function removeItems(db, items) {
  try {
    if (Array.isArray(items)) {
      items.forEach(items => {
        db.remove(items)
      })
    } else {
      db.remove(items)
    }

    store.commit('setIsNotSave')
    return true
  } catch (e) {
    notifyError(e.message)
    console.error(e)
    return false
  }
}

/**
 * 移动多条(条目||群组)
 * @param db 数据库实例
 * @param items (条目||群组)对象数组
 * @param groupUuid 群组 Uuid 对象
 * @return {boolean} 操作成功
 */
export function moveItems(db, items, groupUuid) {
  const checkIllegal = (item) => {
    if (item.uuid.id === groupUuid.id) {
      throw new Error(i18n.t('kdbx.not-allowed-move-group-itself'))
    }
  }

  try {
    const group = db.getGroup(groupUuid)
    if (Array.isArray(items)) {
      items.forEach(item => {
        checkIllegal(item)
        db.move(item, group)
      })
    } else {
      checkIllegal(items)
      db.move(items, group)
    }
    store.commit('setIsNotSave')
    // store.commit('setSelectedGroup', groupUuid)
    return true
  } catch (e) {
    notifyError(e.message)
    console.error(e)
    return false
  }
}

/**
 * 获取群组下的所有条目
 * @param group 群组实例
 * @param isDeep 是否遍历子群组
 * @returns {[]}
 */
export function getEntriesFromGroup(group, isDeep = false) {
  const result = []
  const walkGroups = (groups) => {
    if (!groups || groups.length === 0) return null

    groups.forEach(group => {
      group.entries.forEach(entry => {
        result.push(entry)
      })
      walkGroups(group.groups)
    })
  }

  group.entries.forEach(entry => {
    result.push(entry)
  })

  if (isDeep) {
    walkGroups(group.groups)
  }

  return result
}

/**
 *
 * @param db 数据库实例
 * @param groupUuid 群组 Uuid 对象
 * @param searchText 搜索文本
 * @param isDeep 是否搜索子群组
 */
export function searchEntries(db, groupUuid, searchText, isDeep = false) {
  const group = db.getGroup(groupUuid)

  return getEntriesFromGroup(group, isDeep).filter(entry => {
    return entry.fields.Title.indexOf(searchText) > -1 ||
      entry.fields.Notes.indexOf(searchText) > -1
  })
}
