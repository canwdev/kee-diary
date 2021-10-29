import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import './style/github-markdown.css'
import './style/github-markdown-dark.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import './style/base.scss'

import i18n from './lang/i18n'

const isProd = process.env.NODE_ENV === 'production' // 'development'

import tankUI from '@canwdev/tank-ui'
const tankCSS = new URL('../node_modules/@canwdev/tank-ui/dist/tank-ui.css', import.meta.url)
if (isProd) {
  let file = document.createElement('link');
  file.rel = 'stylesheet';
  file.href = tankCSS.href
  document.head.appendChild(file)
}

Vue.use(tankUI)

Vue.config.productionTip = false

export default new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
