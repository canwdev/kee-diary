import kdbxweb from "kdbxweb"
import store from '@/store'
import getIcon from "../assets/db-icons"

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
}

/**
 * 递归遍历数据库 groups
 * usage: deepWalkGroup(db.groups)
 * return: customized group list
 */
export function deepWalkGroup(node, counter = 0) {
  const list = []
  if (!node || node.length === 0) return list

  node.forEach((group) => {
    const children = group.groups

    list.push({
      img: getIcon(group.icon),
      uuid: group.uuid,
      name: group.name,
      index: counter,
      children: deepWalkGroup(children, counter + 1),
      id: group.uuid.id,
      _group: group
    })
  })
  return list
}

