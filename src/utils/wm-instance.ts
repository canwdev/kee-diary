// 全局唯一实例
import * as path from 'path'
import * as WindowManager from '@canwdev/electron-window-manager'

const wm = new WindowManager({
  preloadDir: path.join(__dirname, '../'),
  isDebug: true,
})

export default wm
