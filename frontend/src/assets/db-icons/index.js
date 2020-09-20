const themeConfig = require('./themes.json')

// const themes = themeConfig.themes.map(item => {
//   return require(`./${themeConfig.baseDir}/${item.dir}.json`)
// })

function Icons(theme) {
  const {
    dir,
    isPixel = false
  } = theme
  this.list = theme.list.map(item => ({
    // 让 Webpack 自动打包图片
    file: require(`./${themeConfig.baseDir}/${dir}/${item.file}`),
    name: item.name
  }))

  this.dir = dir
  this.isPixel = isPixel

  this.getByIndex = function (index) {
    return this.items[index]
  }
}

export default new Icons(require(`./${themeConfig.baseDir}/${themeConfig.themes[1].dir}.json`))
