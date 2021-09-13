function getMapValue(obj, val) {
  if (obj instanceof Map) {
    return obj.get(val)
  }
  return obj[val]
}

class GroupItem {
  constructor(group, children) {
    this.title = group.name
    this.children = children || null
    this.data = {
      uuid: group.uuid.id,
      icon: group.icon,
      // _origin: group
    }
  }
}

class EntryItem {
  constructor(entry, isDetailed) {
    this.uuid = entry.uuid.id
    this.icon = entry.icon
    this.title = getMapValue(entry.fields, 'Title')
    this.bgColor = entry.bgColor
    this.fgColor = entry.fgColor
    this.creationTime = entry.times.creationTime
    this.lastModTime = entry.times.lastModTime
    if (isDetailed) {
      this.notes = getMapValue(entry.fields, 'Notes')
      this._origin = entry
    }
  }
}

module.exports = {
  GroupItem,
  EntryItem,
}
