const LS_KEY = 'KEE_DIARY_VUE_SETTINGS'

export function getSettingsLS() {
  return JSON.parse(localStorage.getItem(LS_KEY))
}

export function setSettingsLS(obj = {}) {
  localStorage.setItem(LS_KEY, JSON.stringify(obj))
}
