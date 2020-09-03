import Vue from 'vue'
import Vuex from 'vuex'
import {getSettingsLS, setSettingsLS} from "@/utils/settings"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    settings: getSettingsLS() || {
      isDarkMode: false,
    }
  },
  getters: {
    isDarkMode: state => state.settings.isDarkMode,
  },
  mutations: {
    setIsDarkMode: (state, val) => {
      state.settings.isDarkMode = val
      setSettingsLS(state.settings)
    },
    updateSettings(state, kv) {
      const {key, value} = kv
      this.state.settings[key] = value
      setSettingsLS(state.settings)
    },
    setIsUnLimited: (state, val) => {
      state.settings.isUnLimited = val
      setSettingsLS(state.settings)
    },
  },
  actions: {
  },
  modules: {
  }
})
