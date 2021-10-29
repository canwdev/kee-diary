// Build kdbx icon json file
// run this script in Node.js to build

const fs = require('fs')
const path = require('path')

function formatIconName(name) {
  return name.slice(name.indexOf('/') + 1, name.indexOf('.'))
}

const themeConfig = require('./themes')

themeConfig.themes.forEach(theme => {
  const {dir} = theme
  fs.readdir(
    path.join(__dirname, themeConfig.baseDir, dir),
    {},
    function (err, list) {
      if (err) {
        console.error(err)
        return
      }
      const data = {
        ...theme,
        list: list.map(item => {
          return {
            file: item,
            name: formatIconName(item)
          }
        })
      }
      const distPath = path.join(__dirname, themeConfig.baseDir, `${dir}.json`)
      fs.writeFileSync(distPath, JSON.stringify(data, null, 2), {encoding: 'utf8'})
      console.log(`Built theme: ${distPath}`)
    })
})

