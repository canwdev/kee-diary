<template>
  <q-page class="row justify-center">
    <div class="col-sm-12 col-md-10 q-pa-lg">
      <TkCard style="height: 100%">
        <TkCard class="q-gutter-y-xs">
          <TkInput
              v-if="isEntryOpen"
              v-model="editing.title"
              dense
              color="secondary"
              placeholder="entry.fields.Title"
          >
            <template v-slot:prepend>
              <ItemIcon
                  class="cursor-pointer"
                  :item="currentEntry"
                  @click.native="isDialogPreviewVisible = true"
              >
                {{ $t('preview') }} (Ctrl+/)
              </ItemIcon>
            </template>

            <ContextMenuCommon
                :target-data="currentEntry"
                :hidden-items="['edit', 'rename']"
                @onPreview="handlePreview"
                @onChangeIcon="isDialogChooseIconVisible = true"
                @onChangeColor="isDialogChooseColorVisible = true"
            />
          </TkInput>

          <div style="overflow: auto; height: calc(100vh - 230px)">
            <textarea id="input-area"></textarea>
          </div>

          <q-toolbar :class="[isDarkMode ? 'bg-grey-9':'bg-grey-3']">
            <div class="row q-gutter-x-md">
              <TkSwitch
                  v-model="isEditWYSIWYG"
              >
                {{ $t('detail.iswysiwyg') }}
              </TkSwitch>
              <q-select
                  v-model="editorTheme"
                  dense
                  color="secondary"
                  :options="themeOptions"
                  style="width: 150px"
              >
                <template v-slot:prepend>
                  <q-icon name="style"/>
                </template>
              </q-select>
              <TkButton-group flat>
                <TkButton
                    dense
                    icon="text_fields"
                    @click="handleChangeFont"
                >
                  <q-tooltip anchor="top middle" self="center middle">{{ $t('detail.changeFontFamily') }}</q-tooltip>
                </TkButton>
              </TkButton-group>
              <TkButton-group flat>
                <TkButton
                    dense
                    icon="archive"
                    @click="handleLoad"
                >
                  <q-tooltip anchor="top middle" self="center middle">{{
                      $t('detail.load-outer-text-file')
                    }}
                  </q-tooltip>
                </TkButton>
                <TkButton
                    dense
                    icon="unarchive"
                    @click="handleExport"
                >
                  <q-tooltip anchor="top middle" self="center middle">{{ $t('detail.export-to-text-file') }}</q-tooltip>
                </TkButton>
                <TkButton
                    dense
                    icon="open_in_browser"
                >
                  <q-tooltip anchor="top middle" self="center middle">{{ $t('detail.edit-with-external') }}
                  </q-tooltip>
                </TkButton>
              </TkButton-group>
            </div>


            <div v-if="isEntryOpen" class="date-display text-right">
              <span>{{ $t('home.created') }}: <DateTimeEdit :date.sync="editing.creationTime"/></span>
              <span>{{ $t('home.modified') }}: <DateTimeEdit disabled :date="lastModTime"/></span>
            </div>
          </q-toolbar>
        </TkCard>
      </TkCard>
    </div>


    <DialogChooseIcon
        :visible.sync="isDialogChooseIconVisible"
        :index="currentEntry.icon"
        @onChoose="handleUpdateIcon"
    />

    <DialogChooseColor
        :item="currentEntry"
        :visible.sync="isDialogChooseColorVisible"
        @onChoose="handleUpdateColor"
    />
  </q-page>
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
import DateTimeEdit from '../components/DateTimeEdit'
import {notifyError, notifySuccess} from '../utils'
import ContextMenuCommon from '@/components/ContextMenuCommon'
import DialogChooseIcon from '@/components/DialogChooseIcon'
import ItemIcon from '@/components/ItemIcon'
import DialogChooseColor from '@/components/DialogChooseColor'

import {textFilters as filters} from '@/enum'

export default {
  name: 'Detail',
  components: {
    DateTimeEdit,
    ContextMenuCommon,
    DialogChooseIcon,
    ItemIcon,
    DialogChooseColor
  },
  data() {
    return {
      editing: {
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
    isEntryOpen: () => store.getters.isEntryOpen,
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
    currentEntry: {
      get: () => store.getters.currentEntry,
      set: val => store.commit('setCurrentEntry', val)
    },
    lockEsc() {
      return this.isDialogPreviewVisible || this.isDialogChooseIconVisible || this.isGlobalLoading || this.isDisableEsc
    }
  },
  watch: {
    currentEntry: {
      handler(nv) {
        if (!nv) {
          this.editor && this.editor.setValue('')
          return
        }
        this.editing = {
          title: nv.fields.Title,
          creationTime: nv.times.creationTime,
        }
        this.lastModTime = nv.times.lastModTime
        this.editor && this.editor.setValue(nv.fields.Notes)
      },
      immediate: true,
    },
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
    editing: {
      handler() {
        store.commit('setIsNotSave')
        const entry = this.currentEntry
        entry.fields.Title = this.editing.title
        entry.times.creationTime = this.editing.creationTime
        this.updateTime()
      },
      deep: true
    }
  },
  mounted() {
    if (!this.isEntryOpen) {
      console.warn('Entry is not open')
      this.$router.push({
        name: 'Home'
      })
      return
    }

    this.initHyperMD()
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
    this.currentEntry = null
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('wheel', this.handleCtrlScroll)
  },
  methods: {
    initHyperMD() {
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
          store.commit('setIsNotSave')
        }
      })
      if (this.currentEntry) {
        editor.setValue(this.currentEntry.fields.Notes)
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
      const entry = this.currentEntry
      if (entry) {
        const newNotes = this.editor.getValue()
        if (entry.fields.Notes !== newNotes) {
          this.updateTime()
          entry.fields.Notes = newNotes
        }
      }
    },
    updateTime() {
      this.currentEntry.times.update()
      this.lastModTime = this.currentEntry.times.lastModTime
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
          this.editing.title = title.replace(/\.[^.$]+$/, '')
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
        defaultPath: this.editing.title + '.txt',
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
      store.commit('setIsNotSave')
    },
    handleUpdateColor(result) {
      const {type, value} = result
      this.currentEntry[type] = value
      store.commit('setIsNotSave')
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
