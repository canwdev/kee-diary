<template>
  <div class="detail-view flex items-center justify-center">
    <TkCard solid class="edit-card">
      <div class="title-row flex">
        <ItemIcon
          class="cursor-pointer"
        >
          {{ $t('preview') }} (Ctrl+/)
        </ItemIcon>

        <TkInput
          v-model="editData.title"
          placeholder="Title"
          class="title-input"
          size="lg"
        />
      </div>

      <hr>

      <div class="settings-row">
        <TkSwitch
          v-model="isEditWYSIWYG"
        >
          {{ $t('detail.iswysiwyg') }}
        </TkSwitch>
        <TkDropdown
          v-model="editorTheme"
          dense
          color="secondary"
          :options="themeOptions"
          style="width: 150px"
        >
          <template v-slot:prepend>
            <q-icon name="style"/>
          </template>
        </TkDropdown>
        <!--        <TkButton-->
        <!--          dense-->
        <!--          icon="text_fields"-->
        <!--          @click="handleChangeFont"-->
        <!--        >-->
        <!--          {{ $t('detail.changeFontFamily') }}-->
        <!--        </TkButton>-->
        <!--        <TkButton-->
        <!--          dense-->
        <!--          icon="archive"-->
        <!--          @click="handleLoad"-->
        <!--        >-->
        <!--          {{-->
        <!--            $t('detail.load-outer-text-file')-->
        <!--          }}-->
        <!--        </TkButton>-->
        <!--        <TkButton-->
        <!--          dense-->
        <!--          icon="unarchive"-->
        <!--          @click="handleExport"-->
        <!--        >-->
        <!--          {{ $t('detail.export-to-text-file') }}-->
        <!--        </TkButton>-->

        <span>{{ $t('home.created') }}: {{ formatDate(editData.creationTime) }}</span>
      </div>

      <hr>

      <div class="edit-wrap">
        <textarea v-show="false" id="input-area"></textarea>
      </div>
    </TkCard>
  </div>
</template>

<script>
import store from '@/store'
import * as HyperMD from 'hypermd'
// 语法高亮
import 'codemirror/mode/htmlmixed/htmlmixed' // Markdown 内嵌HTML
import 'codemirror/mode/stex/stex' // TeX 数学公式
import 'codemirror/mode/yaml/yaml' // Front Matter
// CodeMirror Theme
import 'codemirror/theme/idea.css'
import 'codemirror/theme/elegant.css'
import 'codemirror/theme/yeti.css'
import 'codemirror/theme/darcula.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/theme/gruvbox-dark.css'
import 'codemirror/theme/lesser-dark.css'
import 'codemirror/theme/material.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/theme/mdn-like.css'
import 'codemirror/theme/rubyblue.css'
import 'codemirror/theme/solarized.css'
import 'codemirror/theme/the-matrix.css'

import mainBus, {BUS_SYNC_ENTRY_DETAIL} from '@/utils/bus'
import {formatDate} from '@/utils'
import ItemIcon from '@/components/ItemIcon.vue'
import {getEntryDetail, updateEntry} from '@/api'

import {textFilters as filters} from '@/enum'

const themeOptions = [
  'hypermd-light',
  'default',
  'idea',
  'elegant',
  'yeti',
  'darcula',
  'dracula',
  'gruvbox-dark',
  'lesser-dark',
  'material',
  'monokai',
  'mdn-like',
  'rubyblue',
  'solarized dark',
  'solarized light',
  'the-matrix'
]

export default {
  name: 'Detail',
  components: {
    ItemIcon,
  },
  data() {
    return {
      editData: {
        title: '',
        creationTime: '',
      },
      themeOptions,
      isDisableEsc: false,
      isLoading: false
    }
  },
  computed: {
    isDarkMode: {
      get: () => store.getters.isDarkMode,
    },
    isEditWYSIWYG: {
      get: () => store.getters.isEditWYSIWYG,
      set: val => store.commit('setIsEditWYSIWYG', val)
    },
    isChanged: {
      get: () => store.state.isChanged,
      set: val => store.commit('setIsChanged', val)
    },
    editorTheme: {
      get: () => store.getters.editorTheme || 'hypermd-light',
      set: val => store.commit('setEditorTheme', val)
    },
    editorFontSize: {
      get: () => store.getters.editorFontSize,
      set: val => store.commit('setEditorFontSize', val)
    },
    editorFontFamily: {
      get: () => store.getters.editorFontFamily,
      set: val => store.commit('setEditorFontFamily', val)
    },
    uuid() {
      return this.$route.params.uuid
    }
  },
  watch: {
    isEditWYSIWYG(nv) {
      if (nv) {
        HyperMD.switchToHyperMD(this.editor)
      } else {
        HyperMD.switchToNormal(this.editor)
      }
      this.editor.setOption('theme', this.editorTheme)
    },
    editorTheme(nv) {
      this.editor.setOption('theme', nv)
    },
    editData: {
      handler() {
        if (this.isLoading) {
          return
        }
        this.isChanged = true
      },
      deep: true
    }
  },
  async mounted() {
    await this.initEntryData()

    mainBus.$on(BUS_SYNC_ENTRY_DETAIL, (cb) => {
      this.syncNotes()
      cb && cb()
    })
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('wheel', this.handleCtrlScroll, {passive: false})
  },
  async beforeRouteLeave(to, from, next) {
    // console.log('beforeRouteLeave')
    if (this.isChanged) {
      await this.syncNotes()
    }
    next()
  },
  beforeDestroy() {
    // console.log('beforeDestroy')

    mainBus.$off(BUS_SYNC_ENTRY_DETAIL)
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('wheel', this.handleCtrlScroll)
  },
  methods: {
    formatDate,
    async initEntryData() {
      try {
        this.isLoading = true

        const uuid = this.uuid
        if (!uuid) {
          alert('uuid is not exist!')
          return
        }

        const entry = await getEntryDetail(uuid)

        if (!entry) {
          alert('entry is not exist!')
          return
        }
        this.editData.title = entry.title
        this.editData.creationTime = entry.creationTime
        this.initHyperMD(entry)
      } catch (e) {
        console.error(e)
        this.$toast.error({message: e})
      } finally {
        this.$nextTick(() => {
          this.isLoading = false
        })
      }
    },
    initHyperMD(entry) {
      const textarea = document.getElementById('input-area')
      const editor = HyperMD.fromTextArea(textarea, {
        lineNumbers: false
      })
      if (!this.isEditWYSIWYG) {
        HyperMD.switchToNormal(editor)
      }
      editor.setSize(null, '100%') // set height
      this.setFontFamily(editor)
      this.setFontSize(editor)
      editor.setOption('theme', this.editorTheme)
      editor.on('change', () => {
        if (this.editor) {
          this.isChanged = true
        }
      })
      if (entry && entry.notes) {
        editor.setValue(entry.notes)
      }
      this.editor = editor
    },
    setFontSize(editor) {
      editor = this.editor || editor
      const el = editor.display.wrapper
      el.style.fontSize = this.editorFontSize + 'px'
      editor.refresh()
    },
    setFontFamily(editor) {
      editor = this.editor || editor
      const el = editor.display.wrapper
      if (this.editorFontFamily) {
        el.style.fontFamily = this.editorFontFamily
      } else {
        el.style.fontFamily = null
      }
      editor.refresh()
    },
    async syncNotes() {
      console.log('syncNotes1', this.uuid)

      if (!this.uuid || !this.editor) {
        return
      }
      const res = await updateEntry({
        uuid: this.uuid,
        updates: [
          {path: 'fields.Title', value: this.editData.title},
          {path: 'fields.Notes', value: this.editor.getValue()},
        ]
      })
      console.log('syncNotes2', res)
    },
    handleChangeFont() {
      this.$prompt.create({
        propsData: {
          title: this.$t('detail.changeFontFamily'),
          content: this.editorFontFamily
        }
      }).onConfirm(() => {
        // this.editorFontFamily = ''
        // this.setFontFamily()
      })
    },
    handleKeyDown(event) {
      if (event.key === 'Escape' && !this.lockEsc) {
        event.preventDefault()
        this.$router.push({
          name: 'Home'
        })
      }
      if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
          case '¿': // Keyboard symbol: "/"
            event.preventDefault()
            this.handlePreview()
            break
          default:
            return
        }
      }
    },
    handlePreview() {
      this.syncNotes()
    },
    async handleLoad() {
      try {
        const paths = await window.electronAPI.showFileChooser({
          sizeLimit: 1024000,
          filters
        })
        if (!paths || paths.length === 0) {
          return
        }
        const [path] = paths

        const txt = await window.electronAPI.readFileAsPlainText(path)
        if (!this.editor) {
          return
        }

        if (this.editor.getValue().length === 0) {
          this.editor.setValue(txt)
          return
        }

        this.isDisableEsc = true
        this.$q.dialog({
          title: this.$t('confirm'),
          message: this.$t('detail.confirm-not-empty'),
          persistent: true,
          ok: {
            flat: true,
            label: this.$t('overwrite')
          },
          cancel: {
            flat: true,
            label: this.$t('insert')
          },

        }).onOk(() => {
          const title = path.substring(path.lastIndexOf(`\\`) + 1)
          this.editData.title = title.replace(/\.[^.$]+$/, '')
          this.editor.setValue(txt)
        }).onCancel(() => {
          this.editor.replaceSelection(txt)
        }).onDismiss(() => {
          this.isDisableEsc = false
        })
      } catch (e) {
        this.$toast.error({message: e})
        console.error(e)
      }
    },
    handleExport() {
      window.electronAPI.showSaveDialog(this.editor.getValue(), {
        title: this.$t('export-file'),
        defaultPath: this.editData.title + '.txt',
        filters
      }).then(result => {
        if (result) {
          this.$toast.success({message: 'Success'})
        }
      }).catch(e => {
        this.$toast.error({message: e.message})
        console.error(e)
      })
    },
    handleUpdateIcon(iconIndex) {
      this.currentEntry.icon = iconIndex
    },
    handleUpdateColor(result) {
      const {type, value} = result
      this.currentEntry[type] = value
    },
    handleCtrlScroll(event) {
      if (event.ctrlKey) {
        event.preventDefault()
        let editorFontSize = this.editorFontSize
        if (this.editor) {
          if (event.deltaY > 0) {
            if (editorFontSize <= 0) {
              return
            }
            editorFontSize -= 1
          } else {
            editorFontSize += 1
          }
          this.editorFontSize = editorFontSize
          this.setFontSize()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-view {
  height: 100%;

  .edit-card {
    width: 800px;

    @media screen and (max-width: $mq_mobile_width) {
      width: 100%;
      height: 100%;
      border: none;
    }
  }

  .settings-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .title-row {
    display: flex;
    align-items: center;

    .title-input {
      flex: 1;
    }
  }

  .edit-wrap {
    overflow: auto;
    height: calc(100vh - 230px);
    @media screen and (max-width: $mq_mobile_width) {
      height: calc(100vh - 200px);
    }
  }
}
</style>
