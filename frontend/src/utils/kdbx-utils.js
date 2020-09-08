import kdbxweb from "kdbxweb"
import store from '@/store'
import router from '@/router'
import LocalStorageSettings from "./settings"

const settingsLogin = new LocalStorageSettings('KEE_DIARY_VUE_LOGIN')
import {notifyError, notifySuccess} from '@/utils'
import {busEmitSaveNotes} from "./bus"
import { Dialog } from 'quasar'


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
          { label: 'Save' + andExit, value: true, color: 'positive' },
          { label: 'Don\'t save' + andExit, value: false, color: 'negative' },
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

  if (isGlobalLoading) {
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
      name: group.name,
      index: counter,
      children: getGroupTree(children, counter + 1),
      id: group.uuid.id,
      _group: group
    })
  })
  return list
}

/**
 * 获取某群组的条目列表
 * @param db 数据库实例
 * @param uuid 必须是 uuid 对象，而不是字符串
 * @return {[]}
 */
export function getGroupEntries(db, uuid) {
  const list = []
  if (db && uuid) {
    const group = db.getGroup(uuid)
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
          _entry: entry
        })
      }
    }

  }
  // console.log('getGroupEntries', list)

  return list
}

