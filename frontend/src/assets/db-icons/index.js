const iconMap = require('./icon-map.json')

export default function getIcon(index) {
  return require('./icons/' + iconMap[index])
}
