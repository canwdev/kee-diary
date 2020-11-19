<template>
  <q-page class="flex items-center justify-center bg-wall">
    <div class="text-center">
      <h5 class="text-primary">{{ $t('pages.about') }}</h5>

      <q-card class="text-white q-pa-md q-mb-lg bg-wood">
        <div class="text-bold">{{ message || $t('about.info') }}</div>
        <div class="q-mt-md">
          <VersionText/>
        </div>
      </q-card>

      <div class="content">
        <CheckConnection
            class="q-mb-lg"
            @onMessage="updateMessage"
        />

        <div class="column q-gutter-sm">
          <q-btn color="primary" to="/home">{{$t('about.btnHome')}}</q-btn>
          <q-btn
              outline color="secondary"
              @click="logDatabase"
              title="Ctrl+Shift+I"
          >{{$t('about.btnLogDatabase')}}</q-btn>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script>
import VersionText from "@/components/VersionText"
import CheckConnection from '@/components/CheckConnection'

export default {
  name: "About",
  components: {
    VersionText,
    CheckConnection
  },
  data() {
    return {
      message: null
    }
  },
  methods: {
    logDatabase() {
      const db = this.$store.getters.database
      console.log(db)
    },
    updateMessage(message) {
      this.message = message && `「${message}」`
    }
  }
}
</script>

<style lang="stylus" scoped>
.bg-wood {
  user-select text
  white-space: pre-line;
}
.content {
  margin 0 auto
  width 300px
}
</style>
