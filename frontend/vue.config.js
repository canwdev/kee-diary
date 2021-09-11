const path = require('path')

module.exports = {
  publicPath: './',
  outputDir: '../dist-frontend',
  productionSourceMap: false,
  css: {
    // extract: false,
    sourceMap: false,
    loaderOptions: {
      sass: {
        prependData: `@import "@/style/base.scss";`
      }
    }
  },
}
