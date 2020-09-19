// KDBX Icon from:
// https://github.com/keepassxreboot/keepassxc/tree/develop/share/icons/database
const fs = require('fs')
const path = require('path')


function formatIconName(name) {
  return name.slice(name.indexOf('/') + 1, name.indexOf('.'))
}

const iconThemes = [
  {
    dir: 'icons'
  },
  {
    dir: 'icons-original',
    isPixel: true
  }
]

iconThemes.forEach(theme => {
  const {dir} = theme
  fs.readdir(
    path.join(__dirname, dir),
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

    fs.writeFileSync(path.join(__dirname, `${dir}.json`), JSON.stringify(data, null, 2), {encoding: 'utf8'})
    console.log(`Generated ${dir}.json`)
  })
})

