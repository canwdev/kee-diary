const iconMap = require('./icon-map.json')

export default function Icons() {
  // 让 Webpack 自动打包图片
  this.map = iconMap.map(item => require('./icons/' + item))

  this.getByIndex = function (index) {
    return this.map[index]
  }
}
