<template>
  <TkModalDialog v-model="mVisible" class="settings-dialog" show-close>
    <TkCard class="text-center overflow-hidden">
      <div class="settings-form">
        <div class="settings-title">
          Theme Settings
        </div>
        <div class="settings-content">
          <div class="settings-row">
            <div class="s-label">{{ $t('drawer.themeColor') }}</div>
            <div class="s-actions">
              <input
                class="tk-button-no-style color-input"
                type="color"
                :value="themeColor"
                @change="handleThemeColorChange"
              >
            </div>
          </div>
          <TkButton size="no-style" class="settings-row" @click="fxEnabled = !fxEnabled">
            <div class="s-label">Aero</div>
            <div class="s-actions">
              <TkSwitch :value="fxEnabled"/>
            </div>
          </TkButton>
          <div v-show="fxEnabled" class="settings-row multi-line">
            <div class="s-label">
              <div>Background Style</div>
              <div>
                <TkButton
                  :disabled="backgroundStyle === form.backgroundStyle"
                  size="xs"
                  @click="saveBackgroundStyle"
                >Save
                </TkButton>
              </div>
            </div>
            <div class="s-actions">
              <TkInput placeholder="body CSS styles" v-model="form.backgroundStyle" type="textarea" :disabled="!fxEnabled"/>
            </div>
          </div>
        </div>

      </div>
    </TkCard>
  </TkModalDialog>
</template>

<script>
import visibleMixin from '@/mixins/visible'
import {mapGetters} from 'vuex'
import {hexToRgb} from '@/utils/color'

export default {
  name: 'ThemeSettings',
  mixins: [visibleMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        backgroundStyle: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'themeColor',
      'backgroundStyle'
    ]),
    mVisible: {
      get() {
        return this.visible
      },
      set(nv) {
        this.$emit('update:visible', nv)
      }
    },
    fxEnabled: {
      get() {
        return this.$store.getters.fxEnabled
      },
      set(val) {
        this.$store.commit('updateSettings', {
          key: 'fxEnabled',
          value: val
        })
      }
    },
  },
  watch: {
    backgroundStyle: {
      handler(val) {
        this.form.backgroundStyle = val
      },
      immediate: true
    }
  },
  methods: {
    handleThemeColorChange(event) {
      const colorHex = event.target.value
      const {r, g, b} = hexToRgb(colorHex)
      console.log(colorHex)

      const root = document.documentElement
      root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`)
      this.$store.commit('updateSettings', {
        key: 'themeColor',
        value: colorHex
      })
    },
    saveBackgroundStyle() {

      this.$store.commit('updateSettings', {
        key: 'backgroundStyle',
        value: this.form.backgroundStyle
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.settings-dialog {
  ::v-deep .tk-card {
    padding: 0;
  }
}

.settings-form {
  min-width: 300px;
  text-align: left;

  .settings-title {
    padding: 15px;
    color: $primary;
    font-weight: bold;
    border-bottom: 1px solid;
    font-size: 18px;
  }

  .settings-content {
    padding: 10px;
  }

  .settings-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
    border-radius: 0;

    .s-label {
      font-weight: 600;
    }

    .s-actions {
      display: flex;
      align-items: center;
    }

    & + .settings-row {
      border-top: 1px solid rgba(204, 204, 204, 0.27);
    }

    &.multi-line {
      flex-direction: column;
      align-items: flex-start;

      .s-label {
        width: 100%;
        margin-bottom: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .s-actions {
        display: flex;
        width: 100%;

        textarea {
          width: 100%;
          min-height: 100px;
          font-family: monospace;
        }
      }
    }
  }

  .color-input {
    width: 40px;
    height: 20px;
    padding: 0;
  }
}
</style>
