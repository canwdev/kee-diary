import {ipcRenderer} from 'electron'
import * as remote from '@electron/remote'

import * as Channels from '@canwdev/electron-window-manager/channels'

export const wmUtils = {
  // 创建窗口
  async wmCreateWindow(config: any, url: string) {
    return await ipcRenderer.invoke(Channels.CREATE_WINDOW, config, url)
  },
  // 向窗口发送消息
  async wmSendMessage(windowId: number, message: string) {
    return await ipcRenderer.invoke(Channels.SEND_MESSAGE, windowId, message)
  },
  // 向所有窗口发送广播消息
  async wmSendBroadcastMessage(message: string) {
    return await ipcRenderer.invoke(Channels.SEND_BROADCAST_MESSAGE, message)
  },
  // 获取所有窗口ids
  async wmGetWindowIds() {
    return await ipcRenderer.invoke(Channels.GET_WINDOW_IDS)
  },
  async wmWindowAction(windowId: number, action: string, params: any) {
    return await ipcRenderer.invoke(Channels.WINDOW_ACTION, windowId, action, params)
  },
  wmGetState() {
    return ipcRenderer.invoke(Channels.GET_STATE)
  },
  wmSetState(state: any) {
    return ipcRenderer.invoke(Channels.SET_STATE, state)
  },
  wmUpdateState(path: string, value: any) {
    return ipcRenderer.invoke(Channels.UPDATE_STATE, path, value)
  },
  /**
   * 监听消息更新事件
   * @param channel
   * @param listener 回调函数
   */
  onChannelMessage(channel = Channels.UPDATE_MESSAGE, listener: any) {
    ipcRenderer.on(channel, listener)
  },
  offChannelMessage(channel = Channels.UPDATE_MESSAGE, listener: any) {
    ipcRenderer.off(channel, listener)
  },
  /**
   * 监听窗口变化事件
   * @param listener 回调函数
   */
  onUpdateWindowIds(listener: any) {
    ipcRenderer.on(Channels.UPDATE_WINDOW_IDS, listener)
  },
  // 当前窗口事件监听
  windowEventListener(name: any, callback: any) {
    remote.getCurrentWindow().on(name, callback)
  },
  // 当前窗口事件取消监听
  windowEventListenerOff(name: string, callback: any) {
    remote.getCurrentWindow().off(name, callback)
  },
  // 窗口最小化
  minWindow() {
    remote.getCurrentWindow().minimize()
  },
  // 获取 isMaximized
  getIsMaximized() {
    return remote.getCurrentWindow().isMaximized()
  },
  // 获取 isResizable
  getIsResizable() {
    return remote.getCurrentWindow().isResizable()
  },
  getWindowId() {
    return remote.getCurrentWindow().id
  },
  // 窗口最大化
  maxWindow(isMaxed: boolean) {
    const browserWindow = remote.getCurrentWindow()
    if (!isMaxed) {
      browserWindow.unmaximize()
    } else {
      browserWindow.maximize()
    }
  },
  // 窗口关闭
  closeWindow() {
    remote.getCurrentWindow().close()
  },
  // 窗口隐藏
  hideWindow() {
    remote.getCurrentWindow().hide()
  },
  // 窗口显示
  showWindow() {
    remote.getCurrentWindow().show()
  },
}
