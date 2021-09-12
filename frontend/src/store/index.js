import Vue from 'vue'
import Vuex from 'vuex'
import LocalStorageSettings from '@/utils/settings'
import {KEE_DIARY_VUE_SETTINGS} from '@/enum'
import languages from '@/lang/languages'

import {
  checkIsOpen
} from '@/api'

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
    isGlobalLoading: false, // 全局加载中
    isUnlocked: checkIsOpen() || false, // 数据库是否已解锁
    isNotSave: false, // 有未保存的变更
    selectedGroup: null, // 当前选中的群组
    currentEntry: null, // 当前打开的条目对象
    currentEntryPagination: initEntryListPagination, // 条目列表分页配置
    calendarDate: new Date() // 日历视图
  },
  getters: {
    locate: state => state.settings.locate,
    isDarkMode: state => state.settings.isDarkMode,
    isListView: state => state.settings.isListView,
    isEditWYSIWYG: state => state.settings.isEditWYSIWYG,
    editorTheme: state => state.settings.editorTheme,
    editorFontSize: state => state.settings.editorFontSize || 16,
    editorFontFamily: state => state.settings.editorFontFamily || '',
    databaseRecycleBinEnabled: state => state.database && state.database.meta.recycleBinEnabled,
    isGlobalLoading: state => state.isGlobalLoading,
    isUnlocked: state => state.isUnlocked,
    isNotSave: state => state.isNotSave,
    selectedGroup: state => state.selectedGroup,
    currentEntry: state => state.currentEntry,
    currentEntryPagination: state => state.currentEntryPagination,
    isEntryOpen: state => {
      return Boolean(state.currentEntry)
    },
    calendarDate: state => state.calendarDate,
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
    setSelectedGroup: (state, val) => {
      state.selectedGroup = val
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
    setCalendarDate(state, val) {
      state.calendarDate = val
    }
  },
  actions: {},
  modules: {}
})
