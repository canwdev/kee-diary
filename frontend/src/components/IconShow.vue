<template>
  <q-avatar
      v-if="item"
      class="icon-show"
      :size="size"
      square
      :style="{background: item.bgColor}"
  >
    <span
        v-if="item.fgColor"
        class="color-fg"
        :style="[{background: item.fgColor}, dotStyle]"
    ></span>
    <img :src="getIconSrc(item)" :class="{isPixel}" :style="iconImgStyle">
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
    },
    size: {
      type: String,
      default: '32px'
    },
    isPixel: {
      type: Boolean,
      default: icons.isPixel
    },
    iconScale: {
      type: Number,
      default: 0.8
    }
  },
  methods: {
    getIconSrc(item) {
      const index = item.iconIndex !== undefined ? item.iconIndex : item.icon
      return icons.list[index].file
    }
  },
  computed: {
    dotStyle() {
      if (this.size === '32px') {
        return
      }
      const size = Math.round(parseInt(this.size) / 4)
      const offset = -(size / 2.6)
      return {
        width: size + 'px',
        height: size + 'px',
        top: offset + 'px',
        right: offset + 'px',
      }
    },
    iconImgStyle() {
      const size = Math.round(parseInt(this.size) * this.iconScale)
      return {
        width: size + 'px',
        height: size + 'px'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.icon-show {
  border-radius 5px

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

  .isPixel {
    image-rendering: pixelated
  }
}

</style>
