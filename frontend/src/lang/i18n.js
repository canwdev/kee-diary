import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import languages from "@/lang/languages"
import en from './messages/en'
import zhCN from './messages/zh-CN'

const defaultLocale = languages[0].locate

const i18n = new VueI18n({
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages: {
    [defaultLocale]: en,
    'zh-CN': zhCN
  }
})

export default i18n
