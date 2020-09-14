import {removeItems} from "@/utils/kdbx-utils"

export function handleCommonRename(context, target, isGroup = false) {
  context.$q.dialog({
    title: 'Rename',
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
    context.$store.commit('setIsNotSave')
  })
}

export function handleCommonDelete(context, originTarget, isGroup = false) {
  return new Promise((resolve) => {
    const getTitle = (v) => `<li><span class="text-red">${isGroup ? v.name : v.fields.Title}</span></li>`

    let msgTitles = '', isRecycleBin = false

    if (Array.isArray(originTarget)) {
      msgTitles = originTarget.map(i => getTitle(i)).join('')
    } else {
      msgTitles = getTitle(originTarget)
      isRecycleBin = originTarget.uuid.id === context.database.meta.recycleBinUuid.id
    }



    let msgAction
    if (isRecycleBin) {
      msgAction = '<b>empty recycle bin</b>?'
    } else if (context.$store.getters.databaseRecycleBinEnabled) {
      msgAction = '<b>move to recycle bin</b>?'
    } else {
      msgAction = '<b>DELETE</b>?'
    }

    context.$q.dialog({
      title: 'Confirm',
      message: `Are you sure you want to ${msgAction}<br><ul>${msgTitles}</ul>`,
      html: true,
      cancel: true,
      persistent: false
    }).onOk(() => {
      removeItems(context.database, originTarget)
      return resolve()
    })
  })
}
