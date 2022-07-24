// declare module '*'
declare module '@canwdev/electron-utils'
declare module '@canwdev/electron-utils/*'
declare module '@canwdev/electron-window-manager'
declare module '@canwdev/electron-window-manager/*'

interface Window {
  electronAPI: any
}
