const iconMap = require('./icon-map.json')

export default function getIcon(index) {
  // 让 Webpack 自动打包图片
  const map = iconMap.map(item => require('./icons/' + item))
  return map[index]
}
