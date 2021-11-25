<template>
  <TkModalDialog v-model="mVisible" class="settings-dialog" show-close>
    <TkCard padding="none" class="text-center overflow-hidden">
      <div class="settings-form">
        <div class="settings-title">
          UI Settings
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

          <TkButton size="no-style" class="settings-row" @click="isDarkMode = !isDarkMode">
            <div class="s-label">{{ $t('drawer.darkMode') }}</div>
            <div class="s-actions">
              <TkSwitch :value="isDarkMode"/>
            </div>
          </TkButton>

          <TkButton size="no-style" class="settings-row" @click="fxEnabled = !fxEnabled">
            <div class="s-label">Transparent Blur Effect</div>
            <div class="s-actions">
              <TkSwitch :value="fxEnabled"/>
            </div>
          </TkButton>
          <div class="settings-row multi-line">
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
              <TkInput
                v-model="form.backgroundStyle"
                rows="5"
                placeholder="body CSS styles: background: var(--primary);"
                type="textarea"
              />
            </div>
          </div>

          <TkButton :disabled="eSettings[settingsEnum.keyBordered]" size="no-style" class="settings-row" @click="toggleElectronSettings(settingsEnum.keyWindowTransparent)">
            <div class="s-label">Window Transparent <span class="hover-tips" title="Need restart app">?</span></div>
            <div class="s-actions">
              <TkSwitch :value="eSettings[settingsEnum.keyWindowTransparent]"/>
            </div>
          </TkButton>

          <TkButton size="no-style" class="settings-row" @click="toggleElectronSettings(settingsEnum.keyBordered)">
            <div class="s-label">Window Bordered <span class="hover-tips" title="Need restart app">?</span></div>
            <div class="s-actions">
              <TkSwitch :value="eSettings[settingsEnum.keyBordered]"/>
            </div>
          </TkButton>
        </div>

      </div>
    </TkCard>
  </TkModalDialog>
</template>

<script>
import visibleMixin from '@/mixins/visible'
import {mapGetters} from 'vuex'
import {hexToRgb} from '@/utils/color'
const {electronAPI} = window
const settingsEnum = electronAPI.settingsEnum

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
      },
      settingsEnum,
      eSettings: {
        [settingsEnum.keyWindowTransparent]: false,
        [settingsEnum.keyBordered]: false,
      }
    }
  },
  computed: {
    ...mapGetters([
      'themeColor',
      'backgroundStyle'
    ]),
    isDarkMode: {
      get() {
        return this.$store.getters.isDarkMode
      },
      set(val) {
        this.$store.commit('setIsDarkMode', val)
      }
    },
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
    },
    mVisible(val) {
      if (val) {
        this.loadElectronSettings()
      }
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
    },
    loadElectronSettings() {
      this.eSettings[settingsEnum.keyWindowTransparent] = electronAPI.settingsGet(settingsEnum.keyWindowTransparent) || false
      this.eSettings[settingsEnum.keyBordered] = electronAPI.settingsGet(settingsEnum.keyBordered) || false
    },
    toggleElectronSettings(key) {
      electronAPI.settingsSet(key, !this.eSettings[key])
      this.loadElectronSettings()
    }
  }
}
</script>

