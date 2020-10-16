import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './quasar'
import './styles/base.styl'
import './styles/github-markdown.css'
import './styles/github-markdown-dark.css'
import i18n from './lang/i18n'
Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
