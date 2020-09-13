<template>
  <q-dialog
      v-model="mVisible"
      transition-show="fade"
      transition-hide="fade"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6 row items-center">
          <span class="q-ml-md">Choose Color</span>
          <q-space/>
          <q-toggle
              v-model="isFgColor"
              :color="toggleColor"
              keep-color
              :label="isFgColor ? 'Foreground' : 'Background'"
              left-label
          >
          </q-toggle>
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-section style="max-height: 70vh" class="scroll">
        <q-card flat class="q-gutter-md">
          <span
              class="color-item"
              :class="{active: selectedColor === item.color}"
              v-for="(item, i) in palette"
              :key="i"
              :style="{background: item.color}"
              @click="selectedColor = item.color"
          >
            <q-tooltip>{{ item.name }}</q-tooltip>
          </span>
        </q-card>
      </q-card-section>

      <q-separator/>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup/>
        <q-btn
            :disabled="selectedColor === color"
            @click="handleChoose"
            flat label="Choose" color="primary" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {palette} from "../utils/enum"

function getTypeColor(isFgColor, item) {
  return isFgColor ? item.fgColor : item.bgColor
}

function getColorName(color) {
  const {name} = palette.filter(i => i.color === color)[0] || {}
  return name
}

export default {
  name: "DialogChooseIcon",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: null
    }
  },
  computed: {
    mVisible: {
      get() {
        return this.visible
      },
      set(nv) {
        this.$emit('update:visible', nv)
      }
    },
    color() {
      if (!this.item) {
        return null
      }
      return getTypeColor(this.isFgColor, this.item)
    },
    toggleColor() {
      return getColorName(getTypeColor(this.isFgColor, this.item))
    }
  },
  watch: {
    item: {
      handler(nv) {
        if (!nv) {
          return
        }
        this.selectedColor = getTypeColor(this.isFgColor, this.item)
      },
      immediate: true
    },
    isFgColor(nv) {
      this.selectedColor = getTypeColor(nv, this.item)
    }
  },
  data() {
    return {
      palette: Object.freeze(palette),
      selectedColor: null,
      isFgColor: true
    }
  },
  methods: {
    handleChoose() {
      this.$emit('onChoose', {
        type: this.isFgColor ? 'fgColor' : 'bgColor',
        value: this.selectedColor
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.color-item {
  display inline-block
  width: 45px
  height: 45px
  border-radius 50%;
  overflow: hidden;
  transition all .3s
  cursor pointer
  border 5px solid transparent

  &:hover {
    transform scale(1.1)
  }

  &:active, &.active {
    border-color rgba(0, 0, 0, 0.5)
  }

  &:active {
    transform scale(0.9)
  }
}
</style>
