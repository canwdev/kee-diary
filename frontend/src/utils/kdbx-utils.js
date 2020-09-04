import kdbxweb from "kdbxweb"
import store from '@/store'
import router from '@/router'
import Icons from "../assets/db-icons"

const icons = new Icons()

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

export function closeKdbx() {
  store.commit('setDatabase', null)
  store.commit('setIsUnlocked', false)
  router.replace({
    name: 'Login'
  })
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
      img: icons.getByIndex(group.icon),
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
          uuid: entry.uuid,
          iconImg: icons.getByIndex(entry.icon),
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

