<template>
  <TkModalDialog
    v-model="mVisible"
    show-close
  >
    <TkCard padding="none" class="card-choose-color">

      <div class="settings-form">
        <div class="settings-title">
          <div class="_title flex items-center">
            <ItemIcon :item="iconPreview"/>

            <span>{{ $t('choose') }}</span>

            <TkSwitch
              v-model="isFgColor"
              checkbox
            >
              {{ isFgColor ? $t('foreground') : $t('background') }}
            </TkSwitch>

            <span> {{ $t('color') }}</span>
          </div>
        </div>

        <div class="settings-content">
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
        </div>
      </div>

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
import ItemIcon from './ItemIcon.vue'

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
    ColorItem,
    ItemIcon
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
    },
    colorType() {
      return this.isFgColor ? 'fgColor' : 'bgColor'
    },
    iconPreview() {
      const item = this.item || {}
      return {
        icon: item.icon || item.data.icon,
        [this.colorType]: this.selectedColor
      }
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
        type: this.colorType,
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

  .settings-title {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  ._title {
    .item-icon {
      margin-right: 5px;
    }

    .tk-switch {
      padding: 0 5px;
      font-weight: bold;
    }
  }

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

