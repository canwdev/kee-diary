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
    },
    pkg,
    database: null,
    isUnlocked: false
  },
  getters: {
    isDarkMode: state => state.settings.isDarkMode,
    pkg: state => state.pkg,
    database: state => state.database,
    isUnlocked: state => state.isUnlocked,
  },
  mutations: {
    setIsDarkMode: (state, val) => {
      state.settings.isDarkMode = val
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
  },
  actions: {
  },
  modules: {
  }
})
