const kdbxweb = require('kdbxweb')
const fs = require('fs-extra')
const {
  readFileAsArrayBuffer,
  saveFileFromArrayBuffer
} = require('../utils')

class KdbxInstance {
  constructor() {
    this.resetInstance()
  }

  resetInstance() {
    this.db = null
    this.dbPath = null
  }

  async open(options = {}) {
    console.log('[db] open', options)
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
    console.log(db)
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
}

module.exports = {
  KdbxInstance
}
