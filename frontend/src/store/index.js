import Vue from 'vue'
import Vuex from 'vuex'
import LocalStorageSettings from "@/utils/settings"
import {KEE_DIARY_VUE_SETTINGS} from "@/utils/enum"
import languages from "@/lang/languages"

const pkg = require('@/../../package.json')

Vue.use(Vuex)

const settings = new LocalStorageSettings(KEE_DIARY_VUE_SETTINGS)

const initEntryListPagination = {
  sortBy: 'lastModTime',
  descending: true,
  rowsPerPage: 10,
  page: 1
}

export default new Vuex.Store({
  state: {
    settings: settings.get() || {
      locate: languages[0].locate,
      isDarkMode: false,
      isListView: true, // 是列表视图还是日历视图
      isEditWYSIWYG: true,
      editorTheme: 'hypermd-light',
      editorFontSize: 16, // px
      editorFontFamily: null,
    },
    pkg,
    database: null, // opened kdbx database instance
    dbPath: null, // opened kdbx path
    isGlobalLoading: false, // 全局加载中
    isUnlocked: false, // 数据库是否已解锁
    isNotSave: false, // 有未保存的变更
    currentGroupUuid: null, // 当前选中的群组 Uuid 对象
    currentEntry: null, // 当前打开的条目对象
    currentEntryPagination: initEntryListPagination, // 条目列表分页配置
  },
  getters: {
    locate: state => state.settings.locate,
    isDarkMode: state => state.settings.isDarkMode,
    isListView: state => state.settings.isListView,
    isEditWYSIWYG: state => state.settings.isEditWYSIWYG,
    editorTheme: state => state.settings.editorTheme,
    editorFontSize: state => state.settings.editorFontSize || 16,
    editorFontFamily: state => state.settings.editorFontFamily || '',
    pkg: state => state.pkg,
    database: state => state.database,
    dbPath: state => state.dbPath,
    databaseRecycleBinEnabled: state => state.database && state.database.meta.recycleBinEnabled,
    isGlobalLoading: state => state.isGlobalLoading,
    isUnlocked: state => state.isUnlocked,
    isNotSave: state => state.isNotSave,
    currentGroupUuid: state => state.currentGroupUuid,
    currentEntry: state => state.currentEntry,
    currentEntryPagination: state => state.currentEntryPagination,
    isEntryOpen: state => {
      return Boolean(state.currentEntry)
    },
  },
  mutations: {
    setLocate: (state, val) => {
      state.settings.locate = val
      settings.set(state.settings)
    },
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
    setEditorTheme: (state, val) => {
      state.settings.editorTheme = val
      settings.set(state.settings)
    },
    setEditorFontSize: (state, val) => {
      state.settings.editorFontSize = val
      settings.set(state.settings)
    },
    setEditorFontFamily: (state, val) => {
      state.settings.editorFontFamily = val
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
    setDbPath: (state, val) => {
      state.dbPath = val
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
      window.electronAPI.setShowExitPrompt(val)
      state.isNotSave = val
    },
    setCurrentGroupUuid: (state, val) => {
      if (state.currentGroupUuid && val) {
        // prevent double set
        if (state.currentGroupUuid.id === val.id) {
          return
        }
      }
      state.currentGroupUuid = val
      state.currentEntryPagination = initEntryListPagination
      // console.log('resetPagination', state.currentEntryPagination)
    },
    setCurrentEntry: (state, val) => {
      state.currentEntry = val
    },
    setCurrentEntryPagination: (state, val) => {
      // console.log('setCurrentEntryPagination', val)
      state.currentEntryPagination = val
    },
    setCloseDatabase(state) {
      state.database = null
      state.dbPath = null
      state.currentGroupUuid = null
      state.currentEntry = null
      this.commit('setIsNotSave', false)
      state.isUnlocked = false
    }
  },
  actions: {},
  modules: {}
})
