<template>
  <span>© {{ new Date().getFullYear() }} {{ pkg.appName }} {{ pkg.version }} by {{ pkg.author }}</span>
</template>

<script>
export default {
  name: "VersionText",
  computed: {
    pkg() {
      return this.$store.getters.pkg
    }
  }
}
</script>

<style scoped>

</style>
