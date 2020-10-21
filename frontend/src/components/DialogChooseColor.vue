<template>
  <q-dialog
      v-model="mVisible"
      transition-show="fade"
      transition-hide="fade"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6 row items-center">
          <span class="q-ml-md">{{$t('choose')}} {{ isFgColor ? $t('foreground') : $t('background') }} {{$t('color')}}</span>
          <q-space/>
          <q-toggle
              v-model="isFgColor"
              :color="toggleColor"
              keep-color
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
              :class="{active: selectedColor === item.color, 'no-color': !item.color}"
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
        <q-btn flat :label="$t('cancel')" color="primary" v-close-popup/>
        <q-btn
            :disabled="selectedColor === color"
            @click="handleChoose"
            flat :label="$t('choose')" color="primary" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {palette} from "@/utils/enum"

function getTypeColor(isFgColor, item) {
  if (!item) return
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
  box-shadow 0 1px 2px rgba(0,0,0,0.2)

  &:hover {
    transform scale(1.1)
  }

  &:active, &.active {
    border-color rgba(0, 0, 0, 0.5)
  }

  &:active {
    transform scale(0.9)
  }

  &.no-color {
    background repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 5px,
        #ccc 5px,
        #ccc 10px
    )
  }
}
</style>
