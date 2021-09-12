const kdbxweb = require('kdbxweb')
const fs = require('fs-extra')
const {
  GroupItem,
  EntryItem,
} = require('./enum')
const {
  readFileAsArrayBuffer,
  saveFileFromArrayBuffer
} = require('../utils')

/**
 * 递归遍历数据库 groups
 * usage: getGroupTree(db.groups)
 * return: customized group list
 */
function traverseGroupTree(node, counter = 0) {
  const list = []
  if (!node || node.length === 0) return list

  node.forEach((group) => {
    const children = group.groups

    list.push(new GroupItem(group, traverseGroupTree(children, counter + 1)))
  })
  return list
}

class KdbxInstance {
  constructor() {
    this.resetInstance()
  }

  resetInstance() {
    this.db = null
    this.dbPath = null
    this.curEntryMap = {}
  }

  async open(options = {}) {
    console.log('[db] open')
    const {
      dbPath, password, keyPath
    } = options || {}
    if (!dbPath) {
      throw new Error('[db] dbPath is required!')
    }
    const dbArrayBuffer = await readFileAsArrayBuffer(dbPath)
    let keyFileArrayBuffer
    if (keyPath) {
      keyFileArrayBuffer = await readFileAsArrayBuffer(keyPath)
    }

    const credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString(password), keyFileArrayBuffer)

    const db = await kdbxweb.Kdbx.load(dbArrayBuffer, credentials)

    this.dbPath = dbPath
    this.db = db
    console.log('[db] open success')
    // console.log(db)
  }

  close() {
    if (!this.db) {
      throw new Error('[db] instance is not exist')
    }

    console.log('[db] closing database...')
    // this.db.close()
    this.resetInstance()
    console.log('[db] database closed')
  }


  async save() {
    if (!this.db) {
      throw new Error('[db] instance is not exist')
    }

    console.log('[db] saving database...')
    const buffer = await db.save()
    await saveFileFromArrayBuffer(this.dbPath, buffer)
    console.log('[db] database saved')
  }

  getGroupTree(groupUuid) {
    if (!this.db) {
      throw new Error('db is invalid')
    }

    const group = groupUuid ? this.db.getGroup(groupUuid) : this.db.groups

    return traverseGroupTree(group)
  }

  /**
   * 获取某群组的条目列表
   * @param groupUuid 群组 Uuid 对象，而不是字符串
   * @return {[]}
   */
  getGroupEntries(groupUuid) {
    if (!(this.db && groupUuid)) {
      throw new Error('db or groupUuid is invalid')
    }

    const list = []
    this.curEntryMap = {}
    const group = this.db.getGroup(groupUuid)
    // console.log('getGroup', group)

    if (group) {
      for (let i = group.entries.length - 1; i >= 0; i--) {
        let entry = group.entries[i]
        this.curEntryMap[entry.uuid.id] = entry
        list.push(new EntryItem(entry))
      }
    }
    // console.log('getGroupEntries', list)

    return list
  }
}

module.exports = {
  KdbxInstance
}
