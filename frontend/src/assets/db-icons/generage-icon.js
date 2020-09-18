// KDBX Icon from:
// https://github.com/keepassxreboot/keepassxc/tree/develop/share/icons/database
const fs = require('fs')
const path = require('path')
fs.readdir(path.join(__dirname, 'icons2'), {}, function (err,data) {
  if (err) {
    console.error(err)
    return
  }
  fs.writeFileSync(path.join(__dirname, 'icon-map.json'), JSON.stringify(data, null, 2), {encoding: 'utf8'})
})
