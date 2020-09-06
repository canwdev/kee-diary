import {Notify} from "quasar"

export function formatDateLite(d) {
  // let time = pad2Num(d.getHours()) + ':' + pad2Num(d.getMinutes())
  return d.toISOString().substr(0, 10)
}

export const notifySuccess = (message = 'Success', caption) => {
  Notify.create({
    message: message,
    caption: caption,
    color: 'positive',
    position: 'top',
    icon: 'success',
    timeout: 1500
  })
}

export const notifyError = (message = 'Error', caption) => {
  Notify.create({
    message: message,
    caption: caption,
    color: 'negative',
    position: 'top',
    icon: 'warning',
    timeout: 1500
  })
}
