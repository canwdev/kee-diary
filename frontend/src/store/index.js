import Vue from 'vue'
import Vuex from 'vuex'
import {loadSettings, saveSettings} from '../utils/settings'

import {
  checkIsOpen,
  getIsChanged
} from '@/api'

Vue.use(Vuex)

const pagerOptions = {
  pageSize: 15,
  offset: 0,
  allCount: 0
}

let isMacOS = false
try {
  isMacOS = window.electronAPI.require('os').platform() === 'darwin'
} catch (e) {
  console.warn(e)
}

export default new Vuex.Store({
  state: {
    settings: loadSettings(),
    isGlobalLoading: false,
    isUnlocked: checkIsOpen() || false, // 数据库是否已解锁
    isChanged: getIsChanged() || false, // 有未保存的变更
    selectedGroup: null, // 当前选中的群组
    pagerOptions: {...pagerOptions}, // 条目列表分页配置
    calendarDate: new Date(), // 日历视图
    isMacOS: isMacOS
  },
  getters: {
    isMacOS: state => state.isMacOS,
    isUnlocked: state => state.isUnlocked,
    isChanged: state => state.isChanged,
    isDarkMode: state => state.settings.isDarkMode,
    fxEnabled: state => state.settings.fxEnabled,
    backgroundStyle: state => state.settings.backgroundStyle,
    themeColor: state => state.settings.themeColor,
    isListView: state => state.settings.isListView,
    editorTheme: state => state.settings.editorTheme,
    useSimpleEditor: state => state.settings.useSimpleEditor,
    editorFontSize: state => state.settings.editorFontSize || 16,
    editorFontFamily: state => state.settings.editorFontFamily || '',
    databaseRecycleBinEnabled: state => state.database && state.database.meta.recycleBinEnabled,
  },
  mutations: {
    setIsDarkMode: (state, val) => {
      state.settings.isDarkMode = val
      const {editorTheme} = state.settings
      if (editorTheme === 'vs' || editorTheme === 'vs-dark') {
        state.settings.editorTheme = val ? 'vs-dark' : 'vs'
      }
      saveSettings(state.settings)
    },
    setIsListView: (state, val) => {
      state.settings.isListView = val
      saveSettings(state.settings)
    },
    setEditorTheme: (state, val) => {
      state.settings.editorTheme = val
      saveSettings(state.settings)
    },
    setEditorFontSize: (state, val) => {
      state.settings.editorFontSize = val
      saveSettings(state.settings)
    },
    setEditorFontFamily: (state, val) => {
      state.settings.editorFontFamily = val
      saveSettings(state.settings)
    },
    updateSettings(state, kv) {
      const {key, value} = kv
      this.state.settings[key] = value
      saveSettings(state.settings)
    },
    setIsUnlocked: (state, val) => {
      if (!val) {
        state.isChanged = false
      }
      state.isUnlocked = val
    },
    setIsChanged: (state, val = false) => {
      state.isChanged = val
    },
    setSelectedGroup: (state, val) => {
      // console.log('setSelectedGroup', state.selectedGroup === val)
      state.selectedGroup = val
      // state.pagerOptions = {...pagerOptions}
    },
    setPagerOptions: (state, val) => {
      // console.log('setCurrentEntryPagination', val)
      state.currentEntryPagination = val
    },
    setCalendarDate(state, val) {
      state.calendarDate = val
    },
    setIsGlobalLoading(state, val) {
      state.isGlobalLoading = val
    }
  },
  actions: {},
  modules: {}
})
