<template>
  <img class="icon-img" :src="src"/>
</template>

<script>
export default {
  name: "IconImg",
  props: {
    src: {
      type: String,
      default: null
    }
  }
}
</script>

<style scoped>
.icon-img {
  height: 32px
}
</style>
