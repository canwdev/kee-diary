const LS_KEY_SETTINGS = 'KEE_DIARY_VUE_SETTINGS'

const isSystemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

const defaultSettings = {
  isDarkMode: isSystemDarkMode,
  isListView: true, // 是列表视图还是日历视图
  editorTheme: 'vs',
  editorFontSize: 16, // px
  editorFontFamily: null,
  useSimpleEditor: false,
  themeColor: '#ff7847',
  fxEnabled: false,
  backgroundStyle: `background-color: var(--primary);`
}

export function loadSettings() {
  const settings = JSON.parse(localStorage.getItem(LS_KEY_SETTINGS) || '{}')
  return {...defaultSettings, ...settings}
}

export function saveSettings(obj = {}) {
  localStorage.setItem(LS_KEY_SETTINGS, JSON.stringify(obj))
}
