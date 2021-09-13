import {removeItems} from '@/utils/kdbx-utils'

export function handleCommonRename(context, target, isGroup = false) {
  return new Promise((resolve, reject) => {
    context.$q.dialog({
      title: context.$t('rename'),
      prompt: {
        model: target.title,
        isValid: val => val !== target.title,
        type: 'text'
      },
      cancel: true,
      persistent: false
    }).onOk(data => {
      target.title = data
      if (isGroup) {
        target._origin.name = data
      } else {
        target._origin.fields.Title = data
      }
      context.$store.commit('setIsChanged')
      resolve(data)
    }).onCancel(() => {
      reject()
    })
  })
}

export function handleCommonDelete(context, originTarget, isGroup = false) {
  return new Promise((resolve) => {
    const getTitle = (v) => `<li><span class="text-red">${isGroup ? v.name : v.fields.Title}</span></li>`

    let msgTitles = '';
    let isRecycleBin = false

    if (Array.isArray(originTarget)) {
      msgTitles = originTarget.map(i => getTitle(i)).join('')
    } else {
      msgTitles = getTitle(originTarget)
      isRecycleBin = originTarget.uuid.id === context.database.meta.recycleBinUuid.id
    }

    let msgAction
    if (isRecycleBin) {
      msgAction = `<b>${context.$t('menu.empty-recycle-bin')}</b>?`
    } else if (context.$store.getters.databaseRecycleBinEnabled) {
      msgAction = `<b>${context.$t('menu.move-to-recycle-bin')}</b>?`
    } else {
      msgAction = `<b>${context.$t('delete')}</b>?`
    }

    context.$q.dialog({
      title: context.$t('confirm'),
      message: `${context.$t('menu.are-you-sure')} ${msgAction}<br><ul>${msgTitles}</ul>`,
      html: true,
      cancel: true,
      persistent: false
    }).onOk(() => {
      removeItems(context.database, originTarget)
      return resolve()
    })
  })
}
