<template>
  <div id="app" class="tk-scroll" :class="[isDarkMode ? 'tk-dark-theme' : 'tk-light-theme']">
    <router-view/>
  </div>
</template>

<script>
import store from '@/store'
import {hexToRgb} from '@/utils/color'

export default {
  computed: {
    isDarkMode: {
      get: () => store.getters.isDarkMode
    },
  },
  created() {
    const themeColor = this.$store.getters.themeColor
    // console.log('themeColor', themeColor.value)
    if (themeColor) {
      const {r, g, b} = hexToRgb(themeColor)
      const root = document.documentElement
      root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`)
    }
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
