const path = require('path')

module.exports = {
  publicPath: './',
  outputDir: '../dist-frontend',
  productionSourceMap: false,
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab', // 'manual'
      rtlSupport: false
    },
    'style-resources-loader': {
      'preProcessor': 'stylus',
      'patterns': [
        path.resolve(__dirname, './src/styles/quasar.variables.styl'),
      ]
    }
  },

  transpileDependencies: [
    'quasar'
  ]
}
