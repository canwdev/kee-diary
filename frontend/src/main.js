import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import './style/base.scss'
import './style/github-markdown.css'
import './style/github-markdown-dark.css'
import i18n from './lang/i18n'
const isProd = process.env.NODE_ENV === 'production' // 'development'

import tankUI from '@canwdev/tank-ui'

if (isProd) {
  require('@canwdev/tank-ui/dist/tank-ui.css')
}

Vue.use(tankUI)

Vue.config.productionTip = false

export default new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
