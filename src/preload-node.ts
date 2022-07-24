// 用于 nodeIntegration: true 的情况
import electronAPI from './electron-api'
window.electronAPI = electronAPI
console.log('electronAPI loaded', electronAPI)
