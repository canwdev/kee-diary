<template>
  <span :title="'© ' + new Date().getFullYear() + ' ' + pkg.author">{{ pkg.appName }} v{{ pkg.version }}</span>
</template>

<script>
export default {
  name: 'VersionText',
  computed: {
    pkg() {
      return this.$store.getters.pkg
    }
  }
}
</script>

