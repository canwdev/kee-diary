<template>
  <q-page class="row justify-center">
    <div class="col-sm-12 col-md-10 q-pa-lg">
      <q-card>
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
              <q-btn-group flat >
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
                    dense label="Export">
                  <q-tooltip>Export to text file</q-tooltip>
                </q-btn>
              </q-btn-group>
            </div>


            <q-space/>
            <div class="date-display" v-if="isEntryOpen">
              <span>Created:<DateTimeEdit :date.sync="editing.creationTime"/></span>
              <span>Modified: <DateTimeEdit :date.sync="editing.lastModTime"/></span>
            </div>
          </q-toolbar>

          <textarea id="input-area"></textarea>
        </q-card-section>
      </q-card>
    </div>

    <DialogEntryPreview
        :visible.sync="isDialogPreviewVisible"
        :entry="currentEntry"
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

export default {
  name: "Detail",
  components: {
    DateTimeEdit,
    DialogEntryPreview
  },
  data() {
    return {
      editing: {
        title: '',
        creationTime: '',
        lastModTime: '',
      },
      isDialogPreviewVisible: false,
      themeOptions: [
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
    }
  },
  computed: {
    isDarkMode: {
      get: () => store.getters.isDarkMode,
    },
    isEntryOpen: () => store.getters.isEntryOpen,
    isEditWYSIWYG: {
      get: () => store.getters.isEditWYSIWYG,
      set: val => store.commit('setIsEditWYSIWYG', val)
    },
    editorTheme: {
      get: () => store.getters.editorTheme || 'default',
      set: val => store.commit('setEditorTheme', val)
    },
    currentEntry: {
      get: () => store.getters.currentEntry,
      set: val => store.commit('setCurrentEntry', val)
    },
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
          lastModTime: nv.times.lastModTime,
        }
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
        entry.times.lastModTime = this.editing.lastModTime
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
      const editor = HyperMD.fromTextArea(textarea, {})
      if (!this.isEditWYSIWYG) {
        HyperMD.switchToNormal(editor)
      }
      editor.setOption("theme", this.editorTheme);
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
        entry.fields.Notes = this.editor.getValue()
      }
    },
    handleKeyDown(event) {
      if (event.key === 'Escape' && !this.isDialogPreviewVisible) {
        event.preventDefault()
        this.$router.push({
          name: 'Home'
        })
      }
      if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
          case '¿': // Keyboard symbol: "/"
            event.preventDefault()
            this.isDialogPreviewVisible = !this.isDialogPreviewVisible
            break;
          default:
            return
        }
      }
    },
    handleLoad() {
      const [path] = window.electronAPI.openFileChooser()
      const txt = window.electronAPI.readFileSyncAsPlainText(path)
      alert(txt)
    }
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
