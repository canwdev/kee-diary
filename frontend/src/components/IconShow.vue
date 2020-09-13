<template>
  <q-avatar
      v-if="item"
      class="icon-show"
      size="32px"
      square
      :style="{background: item.bgColor}"
  >
    <span v-if="item.fgColor" class="color-fg" :style="{background: item.fgColor}"></span>
    <img :src="icons[item.icon]">
    <slot></slot>
  </q-avatar>
</template>

<script>
import icons from "@/assets/db-icons"

export default {
  name: "IconShow",
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      icons: Object.freeze(icons.items)
    }
  }
}
</script>

<style lang="stylus" scoped>
.icon-show {
  border-radius 4px
  .color-fg {
    position: absolute;
    top: -3px
    right: -3px
    display block
    border-radius 50%
    width: 8px
    height 8px
    border 1px solid rgba(0, 0, 0, 0.3)
  }
}

</style>
