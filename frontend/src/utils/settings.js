const LS_KEY_LOCWEB_SETTINGS = 'KEE_DIARY_VUE_SETTINGS'
import languages from '@/lang/languages'

const isSystemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

const defaultSettings = {
  locate: languages[0].locate,
  isDarkMode: isSystemDarkMode,
  isListView: true, // 是列表视图还是日历视图
  editorTheme: 'hypermd-light',
  editorFontSize: 16, // px
  editorFontFamily: null,
  themeColor: '#ff7847',
}

export function loadSettings() {
  const settings = JSON.parse(localStorage.getItem(LS_KEY_LOCWEB_SETTINGS) || '{}')
  return {...defaultSettings, ...settings}
}

export function saveSettings(obj = {}) {
  localStorage.setItem(LS_KEY_LOCWEB_SETTINGS, JSON.stringify(obj))
}
