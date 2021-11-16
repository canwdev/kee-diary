<template>
  <TkModalDialog v-model="mVisible" class="settings-dialog" show-close>
    <TkCard padding="none" class="text-center overflow-hidden">
      <div class="settings-form">
        <div class="settings-title">
          Editor Settings
        </div>
        <div class="settings-content">
          <TkButton size="no-style" class="settings-row" @click="useSimpleEditor = !useSimpleEditor">
            <div class="s-label">使用原生编辑器</div>
            <div class="s-actions">
              <TkSwitch :value="useSimpleEditor"/>
            </div>
          </TkButton>

          <div v-if="!useSimpleEditor" class="settings-row">
            <div class="s-label">Editor Theme</div>
            <div class="s-actions">
              <TkDropdown
                v-model="editorTheme"
                dense
                color="secondary"
                :options="themeOptions"
                style="width: 100px"
              />
            </div>
          </div>

          <div class="settings-row multi-line">
            <div class="s-label">
              <div>{{ $t('detail.changeFontFamily') }}</div>
              <div>
                <TkButton
                  size="xs"
                  :disabled="editorFontFamily===form.editorFontFamily"
                  @click="setEditorFontFamily"
                >Save
                </TkButton>
              </div>
            </div>
            <div class="s-actions">
              <TkInput
                v-model="form.editorFontFamily"
                rows="2"
                placeholder="CSS font-family property"
                type="textarea"
              />
            </div>
          </div>

          <div class="settings-row">
            <div class="s-label">Font Size</div>
            <div class="s-actions">
              <TkInput
                v-model="editorFontSize"
                min="1"
                style="width: 100px"
                type="number"
              />
            </div>
          </div>

        </div>
      </div></TkCard>
  </TkModalDialog>
</template>

<script>
import visibleMixin from '@/mixins/visible'
import {mapGetters} from 'vuex'

const themeOptions = [
  'vs',
  'vs-dark',
  'hc-black'
]

export default {
  name: 'EditorSettings',
  mixins: [visibleMixin],
  data() {
    return {
      themeOptions,
      form: {
        editorFontFamily: ''
      }
    }
  },
  computed: {
    useSimpleEditor: {
      get() {
        return this.$store.getters.useSimpleEditor
      },
      set(val) {
        this.$store.commit('updateSettings', {
          key: 'useSimpleEditor',
          value: val
        })
      }
    },
    editorTheme: {
      get() {
        return this.$store.getters.editorTheme || themeOptions[0]
      },
      set(val) {
        this.$store.commit('setEditorTheme', val)
      }
    },
    editorFontFamily: {
      get() {
        return this.$store.getters.editorFontFamily
      },
      set(val) {
        this.$store.commit('setEditorFontFamily', val)
      }
    },
    editorFontSize: {
      get() {
        return this.$store.getters.editorFontSize
      },
      set(val) {
        this.$store.commit('setEditorFontSize', val)
      }
    },
  },
  watch: {
    editorFontFamily: {
      handler(val) {
        this.form.editorFontFamily = val
      },
      immediate: true
    }
  },
  methods: {
    setEditorFontFamily() {
      this.editorFontFamily = this.form.editorFontFamily
    }
  }
}
</script>

