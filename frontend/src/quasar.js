import Vue from 'vue'
import './styles/quasar.styl'
import lang from 'quasar/lang/en-us'
import '@quasar/extras/material-icons/material-icons.css'
import {Quasar, Notify, Dialog} from 'quasar'

Vue.use(Quasar, {
  config: {},
  components: { /* not needed if importStrategy is not 'manual' */},
  directives: { /* not needed if importStrategy is not 'manual' */},
  plugins: {
    Notify,
    Dialog
  },
  lang: lang
})
