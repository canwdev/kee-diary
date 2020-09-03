const path = require('path')

module.exports = {
  publicPath: './',
  outputDir: '../build',

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
