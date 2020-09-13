import kdbxweb from "kdbxweb"
import store from '@/store'
import router from '@/router'
import LocalStorageSettings from "./settings"

const settingsLogin = new LocalStorageSettings('KEE_DIARY_VUE_LOGIN')
import {notifyError, notifySuccess} from '@/utils'
import {busEmitSaveNotes} from "./bus"
import {Dialog} from 'quasar'
import {formatDate} from "@/utils/index"


/**
 * 打开 KDBX 数据库
 * @param dbPath 数据库路径
 * @param password 密码
 * @param keyPath 密钥路径
 */
export function decryptKdbx(dbPath, password, keyPath) {
  return new Promise((resolve, reject) => {
    try {
      const electronAPI = window.electronAPI

      const dbArrayBuffer = electronAPI.readFileSyncAsArrayBuffer(dbPath)

      let keyFileArrayBuffer
      if (keyPath) {
        keyFileArrayBuffer = electronAPI.readFileSyncAsArrayBuffer(keyPath)
      }

      let credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString(password), keyFileArrayBuffer);

      const res = kdbxweb.Kdbx.load(dbArrayBuffer, credentials)
      return resolve(res)
    } catch (e) {
      return reject(e)
    }
  })

}


export function openKdbx(db) {
  store.commit('setDatabase', db)
  store.commit('setIsUnlocked', true)
}

export function doCloseKdbx() {
  store.commit('setCloseDatabase')
  router.replace({
    name: 'Login'
  })
}

export function closeKdbx(isExit = false) {
  const isNotSave = store.getters.isNotSave
  if (isNotSave) {
    const andExit = isExit ? ' and exit' : ''

    Dialog.create({
      title: 'Confirm ' + (isExit ? 'Exit' : 'Close'),
      message: 'There are unsaved changes. Do you want to save?',
      persistent: false,
      options: {
        type: 'radio',
        model: true,
        // inline: true,
        items: [
          {label: 'Save' + andExit, value: true, color: 'positive'},
          {label: 'Don\'t save' + andExit, value: false, color: 'negative'},
        ]
      },
      ok: {
        label: 'Confirm'
      },
      cancel: {
        flat: true,
        label: 'Cancel'
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
    })

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
          notifySuccess('Saved successfully')
          return resolve()
        } catch (e) {
          notifyError(e)
          return reject(e)
        }
      }).finally(() => {
        store.commit('setIsGlobalLoading', false)
      })
    } else {
      const errMsg = 'The database instance does not exist'
      notifyError(errMsg)
      return reject(errMsg)
    }
  })
}

export function saveKdbx() {
  const {dbPath} = settingsLogin.get() || {}
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
        let entry = group.entries[i]
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
export function addEntry(db, groupUuid) {
  try {
    const group = db.getGroup(groupUuid)
    const entry = db.createEntry(group)
    // console.log(db, group)

    entry.fields.Title = formatDate(new Date(), true)
    entry.icon = group.icon

    // console.log(entry)

    store.commit('setCurrentGroupUuid', group.uuid)
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
      throw new Error('Not allowed to move to the group itself')
    }
  }

  try {
    const group = db.getGroup(groupUuid)
    if (Array.isArray(items)) {
      items.forEach(item => {
        checkIllegal(item)
        db.move(item, group);
      })
    } else {
      checkIllegal(items)
      db.move(items, group);
    }
    store.commit('setIsNotSave')
    // store.commit('setCurrentGroupUuid', groupUuid)
    return true
  } catch (e) {
    notifyError(e.message)
    console.error(e)
    return false
  }
}
