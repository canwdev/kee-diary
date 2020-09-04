/**
 * 将设置保存到 LocalStorage
 * 用法： const settings = new LocalStorageSettings('KEE_DIARY_VUE_SETTINGS')
 * @param key 存储对象键值
 * @constructor
 */
function LocalStorageSettings(key = 'TEST_SETTINGS') {
  this.key = key

  this.get = function () {
    return JSON.parse(localStorage.getItem(this.key))
  }

  this.set = function (obj = {}) {
    localStorage.setItem(this.key, JSON.stringify(obj))
  }
}

export default LocalStorageSettings
