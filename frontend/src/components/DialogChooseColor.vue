<template>
  <TkModalDialog
    v-model="mVisible"
    show-close
  >
    <TkCard class="card-choose-color">
      <div class="flex items-center">
        <span class="">{{ $t('choose') }} {{
          isFgColor ? $t('foreground') : $t('background')
        }} {{ $t('color') }}</span>

        <TkSwitch
          v-model="isFgColor"
        >
        </TkSwitch>
      </div>

      <hr/>

      <div class="color-palette">
        <ColorItem
          v-for="(item, i) in palette"
          :key="i"
          :color="item.color"
          :name="item.name"
          :is-active="selectedColor === item.color"
          @click.native="handleSelect(item.color)"
        />
      </div>

      <hr/>

      <div class="action-btn-row" >
        <TkButton :label="$t('cancel')" @click="mVisible = false"/>
        <TkButton
          :disabled="selectedColor === color"
          :label="$t('choose')"

          @click="handleChoose"
        />
      </div>

    </TkCard>
  </TkModalDialog>
</template>

<script>
import {palette} from '@/enum'
import ColorItem from '@/components/ColorItem.vue'

function getTypeColor(isFgColor, item) {
  if (!item) return
  return isFgColor ? item.fgColor : item.bgColor
}

function getColorName(color) {
  const {name} = palette.filter(i => i.color === color)[0] || {}
  return name
}

export default {
  name: 'DialogChooseIcon',
  components: {
    ColorItem
  },
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
    },
    mVisible(val) {
      if (!val) {
        this.selectedColor = getTypeColor(this.isFgColor, this.item)
      }
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
    handleSelect(color) {
      if (this.selectedColor === color) {
        this.handleChoose()
      } else {
        this.selectedColor = color
      }
    },
    handleChoose() {
      this.$emit('onChoose', {
        type: this.isFgColor ? 'fgColor' : 'bgColor',
        value: this.selectedColor
      })
      this.mVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.card-choose-color {
  max-width: 500px;

  .color-palette {
    max-height: 70vh;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    padding: 10px 0;

    .color-item {
      margin: 5px;
    }
  }
}
</style>

