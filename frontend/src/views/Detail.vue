<template>
  <q-page class="row justify-center">
    <div class="col-sm-12 col-md-10 q-pa-lg">
      <q-card style="height: 100%">
        <q-card-section class="q-gutter-y-xs">
          <q-input
              v-if="isEntryOpen"
              v-model="editing.title"
              dense
              color="secondary"
              placeholder="entry.fields.Title">
            <template v-slot:prepend>
              <q-avatar size="32px" square class="cursor-pointer" @click="isDialogPreviewVisible = true">
                <img :src="getIcon(currentEntry.icon)">
                <q-tooltip>Preview (Ctrl+/)</q-tooltip>
              </q-avatar>
            </template>

            <ContextMenuCommon
                :target-data="currentEntry"
                :hidden-items="['edit', 'rename']"
                @onPreview="handlePreview"
                @onChangeIcon="isDialogChooseIconVisible = true"
            />
          </q-input>

          <q-toolbar :class="[isDarkMode ? 'bg-grey-9':'bg-grey-3']">
            <div class="row q-gutter-x-md">
              <q-toggle
                  v-model="isEditWYSIWYG"
                  color="secondary"
                  checked-icon="edit"
                  unchecked-icon="code"
              >
                <q-tooltip>isWYSIWYG</q-tooltip>
              </q-toggle>
              <q-select
                  dense
                  color="secondary"
                  v-model="editorTheme" :options="themeOptions" label="Theme"
                  style="width: 150px"
              />
              <q-btn-group flat>
                <q-btn
                    @click="handleLoad"
                    dense label="Load">
                  <q-tooltip>Load outer text file</q-tooltip>
                </q-btn>
                <q-btn
                    dense label="External">
                  <q-tooltip>Edit with external tools</q-tooltip>
                </q-btn>
                <q-btn
                    @click="handleExport"
                    dense label="Export">
                  <q-tooltip>Export to text file</q-tooltip>
                </q-btn>
              </q-btn-group>
            </div>


            <q-space/>
            <div class="date-display text-right" v-if="isEntryOpen">
              <span>Created: <DateTimeEdit :date.sync="editing.creationTime"/></span>
              <span>Modified: <DateTimeEdit disabled :date.sync="lastModTime"/></span>
            </div>
          </q-toolbar>

          <div style="overflow: auto; height: calc(100vh - 230px)">
            <textarea id="input-area"></textarea>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <DialogEntryPreview
        :visible.sync="isDialogPreviewVisible"
        :entry="currentEntry"
    />

    <DialogChooseIcon
        :visible.sync="isDialogChooseIconVisible"
        :index="currentEntry.icon"
        @onChoose="handleUpdateIcon"
    />
  </q-page>
</template>

<script>
import store from '@/store'
import * as HyperMD from 'hypermd'
// 语法高亮
import "codemirror/mode/htmlmixed/htmlmixed" // Markdown 内嵌HTML
import "codemirror/mode/stex/stex" // TeX 数学公式
import "codemirror/mode/yaml/yaml" // Front Matter

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

import icons from "@/assets/db-icons"
import bus, {BUS_SAVE_NOTES_START} from '@/utils/bus'
import DateTimeEdit from "../components/DateTimeEdit"
import DialogEntryPreview from "@/components/DialogEntryPreview"
import {notifyError, notifySuccess} from "../utils"
import ContextMenuCommon from "@/components/ContextMenuCommon"
import DialogChooseIcon from "@/components/DialogChooseIcon"

import {textFilters as filters} from "../utils/enum"

export default {
  name: "Detail",
  components: {
    DateTimeEdit,
    DialogEntryPreview,
    ContextMenuCommon,
    DialogChooseIcon
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
      this.editor.setOption("theme", this.editorTheme);
    },
    editorTheme(nv) {
      this.editor.setOption("theme", nv);
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
    this.initHyperMD()
    bus.$on(BUS_SAVE_NOTES_START, (resolve) => {
      this.syncNotes()
      resolve()
    })
    window.addEventListener('keydown', this.handleKeyDown)
  },
  beforeDestroy() {
    this.syncNotes()
    bus.$off(BUS_SAVE_NOTES_START)
    this.currentEntry = null
    window.removeEventListener('keydown', this.handleKeyDown)
  },
  methods: {
    getIcon(index) {
      return icons.getByIndex(index)
    },
    initHyperMD() {
      const textarea = document.getElementById('input-area')
      const editor = HyperMD.fromTextArea(textarea, {
        theme: this.editorTheme,
        lineNumbers: false
      })
      if (!this.isEditWYSIWYG) {
        HyperMD.switchToNormal(editor)
      }
      editor.setSize(null, "100%") // set height
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
    syncNotes() {
      const entry = this.currentEntry
      if (entry) {
        const newNotes = this.editor.getValue()
        if (entry.fields.Notes !== newNotes) {
          entry.fields.Notes = newNotes
          this.updateTime()
        }
      }
    },
    updateTime() {
      this.currentEntry.times.update()
      this.lastModTime = this.currentEntry.times.lastModTime
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
            break;
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
        const paths = await window.electronAPI.openFileChooser({
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
          title: 'Confirm',
          message: 'The text area is not empty, do you want to overwrite it?',
          persistent: true,
          ok: {
            flat: true,
            label: 'Overwrite'
          },
          cancel: {
            flat: true,
            label: 'Insert'
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

      window.electronAPI.saveAsFile(this.editor.getValue(), {
        title: 'Export file',
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
  }
}
</script>

<style lang="stylus" scoped>
.date-display {
  display flex
  flex-direction column

  .q-btn {
    line-height: 1
  }
}
</style>
