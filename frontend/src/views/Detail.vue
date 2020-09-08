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
              <q-avatar size="32px" square>
                <img :src="getIcon(currentEntry.icon)">
              </q-avatar>
            </template>
          </q-input>

          <q-toolbar :class="[isDarkMode ? 'bg-grey-9':'bg-grey-3']">
            <q-toggle
                v-model="isEditWYSIWYG"
                color="secondary"
                checked-icon="edit"
                unchecked-icon="code"
            >
              <q-tooltip>isWYSIWYG</q-tooltip>
            </q-toggle>
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

  </q-page>
</template>

<script>
import store from '@/store'
import * as HyperMD from 'hypermd'
// 语法高亮
require("codemirror/mode/htmlmixed/htmlmixed") // Markdown 内嵌HTML
require("codemirror/mode/stex/stex") // TeX 数学公式
require("codemirror/mode/yaml/yaml") // Front Matter

import icons from "@/assets/db-icons"
import bus, {BUS_SAVE_NOTES_START} from '@/utils/bus'
import DateTimeEdit from "../components/DateTimeEdit"

export default {
  name: "Detail",
  components: {
    DateTimeEdit
  },
  data() {
    return {
      editing: {
        title: '',
        creationTime: '',
        lastModTime: '',
      }
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
      if (event.key === 'Escape') {
        event.preventDefault()
        this.$router.push({
          name: 'Home'
        })
      }
      if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
          case '¿': // Keyboard symbol: "/"
            event.preventDefault()
            this.isEditWYSIWYG = !this.isEditWYSIWYG
            break;
          default:
            return
        }
      }
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
