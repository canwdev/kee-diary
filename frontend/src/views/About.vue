<template>
  <div class="flex items-center justify-center bg-wall">
    <div class="text-center">
      <h5 class="text-primary">{{ $t('pages.about') }}</h5>

      <TkCard class="">
        <div class="">{{ message || $t('about.info') }}</div>
        <div class="">
          <VersionText/>
        </div>
      </TkCard>

      <div class="content">
        <CheckConnection
            class=""
            @onMessage="updateMessage"
        />

        <div class="column q-gutter-sm">
          <TkButton>
            <TkLink href="/home">{{ $t('about.btnHome') }}</TkLink>
          </TkButton>
          <TkButton
              outline
              color="secondary"
              title="Ctrl+Shift+I"
              @click="logDatabase"
          >{{ $t('about.btnLogDatabase') }}
          </TkButton>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import VersionText from '@/components/VersionText'
import CheckConnection from '@/components/CheckConnection'

export default {
  name: 'About',
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

<style lang="scss" scoped>
.bg-wood {
  user-select: text;
  white-space: pre-line;
}

.content {
  margin: 0 auto;
  width: 300px;
}
</style>
