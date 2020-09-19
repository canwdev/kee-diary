const theme = require('./icons-original.json')

function Icons() {
  const {
    dir,
    isPixel = false
  } = theme
  this.list = theme.list.map(item => ({
    // 让 Webpack 自动打包图片
    file: require(`./${dir}/${item.file}`),
    name: item.name
  }))

  this.dir = dir
  this.isPixel = isPixel

  this.getByIndex = function (index) {
    return this.items[index]
  }
}

export default new Icons()
