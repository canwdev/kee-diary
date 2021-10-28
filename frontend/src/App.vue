<template>
  <div id="app" class="tk-scroll" :class="[isDarkMode ? 'tk-dark-theme' : 'tk-light-theme']">
    <router-view/>
  </div>
</template>

<script>
import store from '@/store'

export default {
  computed: {
    isDarkMode: {
      get: () => store.getters.isDarkMode
    },
  },
  mounted() {
    document.body.classList.add('body-bordered')
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  //user-select: none
}
</style>
