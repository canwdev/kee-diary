import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import './style/base.scss'
import './style/github-markdown.css'
import './style/github-markdown-dark.css'
import i18n from './lang/i18n'
// import tankUI from '@canwdev/tank-ui'
// import '@canwdev/tank-ui/dist/tank-ui.css'
const {tankUI: {default: tankUI}} = window

Vue.use(tankUI)

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
