<template>
  <div
    v-if="item"
    class="item-icon relative-position"
    :style="{background: item.bgColor}"
  >
    <span
      v-if="item.fgColor"
      class="color-fg"
      :style="[{background: item.fgColor}, dotStyle]"
    ></span>
    <img :src="getIconSrc(item)" :class="{isPixel}" :style="iconImgStyle">
    <slot></slot>
  </div>
</template>

<script>
import icons from '@/assets/db-icons'

export default {
  name: 'ItemIcon',
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
      return icons.list[index] && icons.list[index].file
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

<style lang="scss" scoped>
.item-icon {
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;

  .color-fg {
    position: absolute;
    top: -3px;
    right: -3px;
    display: block;
    border-radius: 50%;
    width: 7px;
    height: 7px;
    border: 1px solid rgba(114, 114, 114, 0.5);
  }

  .isPixel {
    image-rendering: pixelated;
  }
}
</style>
