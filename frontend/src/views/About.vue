<template>
  <q-page class="flex items-center justify-center bg-wall">
    <div class="text-center">
      <h5 class="text-primary">{{ $t('pages.about') }}</h5>

      <q-card class="text-white q-pa-md q-mb-lg bg-wood">
        <div class="text-bold" v-html="$t('about.info')"></div>
        <div class="q-mt-md">
          <VersionText/>
        </div>
      </q-card>


      <div class="column q-gutter-sm">
        <q-btn color="primary" to="/home">{{$t('about.btnHome')}}</q-btn>
        <q-btn
            outline color="secondary"
            @click="logDatabase"
            title="Ctrl+Shift+I"
        >{{$t('about.btnLogDatabase')}}</q-btn>
        <q-btn outline color="secondary" no-caps @click="checkOnline">Check Online</q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import VersionText from "@/components/VersionText"

export default {
  name: "About",
  components: {
    VersionText
  },
  methods: {
    logDatabase() {
      const db = this.$store.getters.database
      console.log(db)
    },
    checkOnline() {
      // console.log('window.navigator.onLine', window.navigator.onLine)
      window.electronAPI.checkIsOnLine().then(flag => {
        console.log(flag)
      })
    }
  }
}
</script>
