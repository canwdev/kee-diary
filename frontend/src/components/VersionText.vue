<template>
  <span :title="'© ' + new Date().getFullYear() + ' ' + pkg.author">{{ pkg.appName }} v{{ pkg.version }}</span>
</template>

<script>
// const pkg = require('@/../../package.json')
import pkg from '@/../../package.json'
export default {
  name: 'VersionText',
  data() {
    return {
      pkg
    }
  }
}
</script>

