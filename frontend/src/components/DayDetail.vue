<template>
  <span
      v-if="lunarData"
      :title="JSON.stringify(lunarData, null, 2)"
  >
    {{ lunarData.dayCn }}
  </span>
</template>

<script>
export default {
  name: "DayDetail",
  props: {
    lunarData: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped>

</style>
