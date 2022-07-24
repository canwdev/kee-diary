import * as fsUtil from './fs-util'
import {wmUtils} from './wm-preload'
import * as ipcHelper from '@canwdev/electron-utils/ipc/ipc-helper-render'

export default {
  ...fsUtil,
  ...ipcHelper,
  wmUtils,
}
