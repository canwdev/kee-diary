import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './quasar'
import './styles/github-markdown.css'
import './styles/github-markdown-dark.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
