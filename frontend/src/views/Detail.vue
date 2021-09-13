<template>
  <div class="flex justify-center">
    <TkCard style="height: 100%" class="q-gutter-y-xs">
      <div>
        <div class="row q-gutter-x-md">
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
          <TkButton
            dense
            icon="text_fields"
            @click="handleChangeFont"
          >
            {{ $t('detail.changeFontFamily') }}
          </TkButton>
          <TkButton
            dense
            icon="archive"
            @click="handleLoad"
          >
            {{
              $t('detail.load-outer-text-file')
            }}
          </TkButton>
          <TkButton
            dense
            icon="unarchive"
            @click="handleExport"
          >
            {{ $t('detail.export-to-text-file') }}
          </TkButton>
          <TkButton
            dense
            icon="open_in_browser"
          >
            {{ $t('detail.edit-with-external') }}
          </TkButton>
        </div>

        <div class="date-display text-right">
          <span>{{ $t('home.created') }}: {{ editingObj.creationTime }}</span>
          <span>{{ $t('home.modified') }}: {{ lastModTime }}></span>
        </div>
      </div>

      <ItemIcon
        class="cursor-pointer"
        @click.native="isDialogPreviewVisible = true"
      >
        {{ $t('preview') }} (Ctrl+/)
      </ItemIcon>

      <TkInput
        v-model="editingObj.title"
        placeholder="Title"
      />

      <div style="overflow: auto; height: calc(100vh - 230px)">
        <textarea id="input-area"></textarea>
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

import bus, {BUS_SAVE_NOTES_START} from '@/utils/bus'
import {notifyError, notifySuccess} from '../utils'
import ItemIcon from '@/components/ItemIcon'
import {getEntryDetail} from '@/api'

import {textFilters as filters} from '@/enum'

export default {
  name: 'Detail',
  components: {
    ItemIcon,
  },
  data() {
    return {
      editingObj: {
        title: '',
        creationTime: '',
      },
      lastModTime: '',
      isDialogPreviewVisible: false,
      isDialogChooseIconVisible: false,
      isDialogChooseColorVisible: false,
      themeOptions: [
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
        'the-matrix',
      ],
      isDisableEsc: false
    }
  },
  computed: {
    isDarkMode: {
      get: () => store.getters.isDarkMode,
    },
    isGlobalLoading: () => store.getters.isGlobalLoading,
    isEditWYSIWYG: {
      get: () => store.getters.isEditWYSIWYG,
      set: val => store.commit('setIsEditWYSIWYG', val)
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
    lockEsc() {
      return this.isDialogPreviewVisible || this.isDialogChooseIconVisible || this.isGlobalLoading || this.isDisableEsc
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
    editingObj: {
      handler() {
        store.commit('setIsChanged')
        // const entry = this.currentEntry
        // entry.fields.Title = this.editingObj.title
        // entry.times.creationTime = this.editingObj.creationTime
        // this.updateTime()
      },
      deep: true
    }
  },
  async mounted() {
    const uuid = this.$route.params.uuid
    if (!uuid) {
      alert('uuid is not exist!')
      return
    }

    const entry = await getEntryDetail(uuid)

    if (!entry) {
      alert('entry is not exist!')
      return
    }

    this.initHyperMD(entry)
    this.editingObj.title = entry.title

    bus.$on(BUS_SAVE_NOTES_START, (resolve) => {
      this.syncNotes()
      resolve()
    })
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('wheel', this.handleCtrlScroll, {passive: false})
  },
  beforeDestroy() {
    this.syncNotes()
    bus.$off(BUS_SAVE_NOTES_START)
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('wheel', this.handleCtrlScroll)
  },
  methods: {
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
          store.commit('setIsChanged')
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
    syncNotes() {
      // const entry = this.currentEntry
      // if (entry) {
      //   const newNotes = this.editor.getValue()
      //   if (entry.fields.Notes !== newNotes) {
      //     this.updateTime()
      //     entry.fields.Notes = newNotes
      //   }
      // }
    },
    updateTime() {
      // this.currentEntry.times.update()
      // this.lastModTime = this.currentEntry.times.lastModTime
    },
    handleChangeFont() {
      this.$q.dialog({
        title: this.$t('detail.changeFontFamily'),
        prompt: {
          model: this.editorFontFamily,
          type: 'text'
        },
        cancel: true,
        persistent: false
      }).onOk(data => {
        this.editorFontFamily = data
        this.setFontFamily()
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
      this.isDialogPreviewVisible = !this.isDialogPreviewVisible
    },
    async handleLoad() {
      this.$store.commit('setIsGlobalLoading')

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
          this.editingObj.title = title.replace(/\.[^.$]+$/, '')
          this.editor.setValue(txt)
        }).onCancel(() => {
          this.editor.replaceSelection(txt)
        }).onDismiss(() => {
          this.isDisableEsc = false
        })
      } catch (e) {
        notifyError(e.message)
        console.error(e)
      } finally {
        this.$store.commit('setIsGlobalLoading', false)
      }
    },
    handleExport() {
      this.$store.commit('setIsGlobalLoading')

      window.electronAPI.showSaveDialog(this.editor.getValue(), {
        title: this.$t('export-file'),
        defaultPath: this.editingObj.title + '.txt',
        filters
      }).then(result => {
        if (result) {
          notifySuccess()
        }
      }).catch(e => {
        notifyError(e.message)
        console.error(e)
      }).finally(() => {
        this.$store.commit('setIsGlobalLoading', false)
      })
    },
    handleUpdateIcon(iconIndex) {
      this.currentEntry.icon = iconIndex
      store.commit('setIsChanged')
    },
    handleUpdateColor(result) {
      const {type, value} = result
      this.currentEntry[type] = value
      store.commit('setIsChanged')
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
.date-display {
  display: flex;
  flex-direction: column;

  .TkButton {
    line-height: 1;
  }
}
</style>
