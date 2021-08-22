import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueI18n from './lang/i18n'

import 'normalize.css'
import './utils/notify'
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import './style/tools.sass'
import './style/base.scss'

createApp(App)
  .use(VueI18n)
  .use(store)
  .use(router)
  .mount('#app')
