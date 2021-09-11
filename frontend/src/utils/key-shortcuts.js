import {saveKdbx, closeKdbx} from './kdbx-utils'
import _debounce from 'lodash/debounce'
import {isOutboundURL} from '@/utils/is'

// 注册键盘快捷键
export function registerKeyShortcuts() {
  window.addEventListener('keydown', handleKey)
  window.addEventListener('click', handleClick)
  // setTimeout(() => {
  //   window.electronAPI.onMessage('app-closing', handleAppClose)
  // }, 500)
}

export function unRegisterKeyShortcuts() {
  window.removeEventListener('keydown', handleKey)
  window.removeEventListener('click', handleClick)
  // window.electronAPI.offMessage('app-closing')
}

function _closeKdbx() {
  closeKdbx(true)
}

// _debounce function prevents repeated execution in an instant
export const handleAppClose = _debounce(_closeKdbx, 1000, {
  'leading': true,
  'trailing': false
})

function handleKey(event) {
  if (event.ctrlKey || event.metaKey) {
    switch (String.fromCharCode(event.which).toLowerCase()) {
      case 's':
        event.preventDefault()
        saveKdbx()
        break
      case 'l':
        event.preventDefault()
        closeKdbx()
        break
      default:
        return
    }
  }
}

function handleClick(event) {
  // 在外部打开链接
  if (event.target.tagName === 'A') {
    if (isOutboundURL(event.target.getAttribute('href'))) {
      event.preventDefault()
      window.electronAPI.openExternal(event.target.href)
    }
  }
}
