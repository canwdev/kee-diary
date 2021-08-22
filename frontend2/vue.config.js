// vue.config.js
module.exports = {
  publicPath: './',
  outputDir: '../dist-frontend',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/style/variables.sass";`
      }
    }
  }
}
