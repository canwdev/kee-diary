import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import tankUI from '@canwdev/tank-ui'
// import '@canwdev/tank-ui/dist/tank-ui.css'
const {tankUI: {default: tankUI}} = window

Vue.use(tankUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
