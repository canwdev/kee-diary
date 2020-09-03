module.exports = {
  publicPath: './',
  outputDir: '../build',

  pluginOptions: {
    quasar: {
      importStrategy: 'manual',
      rtlSupport: false
    }
  },

  transpileDependencies: [
    'quasar'
  ]
}
