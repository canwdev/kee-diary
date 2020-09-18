const iconMap = require('./icon-map.json')

function Icons() {
  // 让 Webpack 自动打包图片
  this.items = iconMap.map(item => require('./icons2/' + item))

  this.getByIndex = function (index) {
    return this.items[index]
  }
}

export function formatIconName(name) {
  return name.slice(name.indexOf('/') + 1, name.indexOf('.'))
}

export default new Icons()
