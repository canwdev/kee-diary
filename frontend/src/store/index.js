import Vue from 'vue'
import Vuex from 'vuex'
import LocalStorageSettings from "@/utils/settings"

const pkg = require('@/../package.json')
Vue.use(Vuex)

const settings = new LocalStorageSettings('KEE_DIARY_VUE_SETTINGS')

export default new Vuex.Store({
  state: {
    settings: settings.get() || {
      isDarkMode: false,
      isListView: true, // 是列表视图还是日历视图
      isEditWYSIWYG: true
    },
    pkg,
    database: null, // kdbx 数据库实例
    isGlobalLoading: false, // 全局加载中
    isUnlocked: false, // 数据库是否已解锁
    isNotSave: false, // 有未保存的变更
    currentGroupUuid: null, // 当前选中的群组 UUID 对象
    currentEntry: null, // 当前打开的条目对象
  },
  getters: {
    isDarkMode: state => state.settings.isDarkMode,
    isListView: state => state.settings.isListView,
    isEditWYSIWYG: state => state.settings.isEditWYSIWYG,
    pkg: state => state.pkg,
    database: state => state.database,
    isGlobalLoading: state => state.isGlobalLoading,
    isUnlocked: state => state.isUnlocked,
    isNotSave: state => state.isNotSave,
    currentGroupUuid: state => state.currentGroupUuid,
    currentEntry: state => state.currentEntry,
    isEntryOpen: state => {
      return Boolean(state.currentEntry)
    },
  },
  mutations: {
    setIsDarkMode: (state, val) => {
      state.settings.isDarkMode = val
      settings.set(state.settings)
    },
    setIsListView: (state, val) => {
      state.settings.isListView = val
      settings.set(state.settings)
    },
    setIsEditWYSIWYG: (state, val) => {
      state.settings.isEditWYSIWYG = val
      settings.set(state.settings)
    },
    updateSettings(state, kv) {
      const {key, value} = kv
      this.state.settings[key] = value
      settings.set(state.settings)
    },
    setDatabase: (state, val) => {
      state.database = val
    },
    setIsUnlocked: (state, val) => {
      state.isUnlocked = val
    },
    setIsGlobalLoading: (state, val = true) => {
      state.isGlobalLoading = val
    },
    setIsNotSave: (state, val = true) => {
      if (state.isNotSave === val) {
        return
      }
      if (val) {
        window.electronAPI.setShowExitPrompt(val)
      }
      state.isNotSave = val
    },
    setCurrentGroupUuid: (state, val) => {
      state.currentGroupUuid = val
    },
    setCurrentEntry: (state, val) => {
      state.currentEntry = val
    },
  },
  actions: {},
  modules: {}
})
