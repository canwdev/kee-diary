import themeConfig from './themes.json'
import theme from './themes/icons.json'

// const themes = themeConfig.themes.map(item => {
//   return require(`./${themeConfig.baseDir}/${item.dir}.json`)
// })

function Icons(theme) {
  const {
    dir,
    isPixel = false
  } = theme
  this.list = theme.list.map(item => {
    const imgUrl = new URL(`./${themeConfig.baseDir}/${dir}/${item.file}`, import.meta.url).href
    return {
      file: imgUrl,
      name: item.name
    }
  })

  this.dir = dir
  this.isPixel = isPixel

  this.getByIndex = function (index) {
    return this.items[index]
  }
}

export default new Icons(theme)
