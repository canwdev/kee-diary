<template>
  <div class="flex items-center justify-center bg-wall">
    <div class="text-center">
      <h1 class="text-primary">{{ $t('pages.about') }}</h1>

      <TkCard class="about-card" solid>
        <h3><VersionText/></h3>
        <hr>
        <div>
          {{ $t('about.info')+'1' }}
        </div>

        <template v-if="message">
          <hr>
          <div>{{ message }}</div>
        </template>
      </TkCard>

      <div class="content">
        <CheckConnection
          @onMessage="updateMessage"
        />

        <div class="about-buttons">
          <TkLink class="tk-button" href="/home">
            {{ $t('about.btnHome') }}
          </TkLink>
          <TkButton
            theme="secondary"
            @click="logDatabase"
          >{{ $t('about.btnLogDatabase') }}
          </TkButton>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import VersionText from '@/components/VersionText.vue'
import CheckConnection from '@/components/CheckConnection/index.vue'

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
.about-card {
  margin-bottom: 10px;
}

.content {
  margin: 0 auto;
  width: 300px;

  .about-buttons {
    a, button {
      color: inherit;
      display: block;
      width: 100%;
      margin-top: 10px;
    }
  }
}
</style>
