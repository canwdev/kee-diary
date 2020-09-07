<template>
  <q-page class="row justify-center">
    <div class="col-md-10 q-pa-lg">
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

          <q-toolbar class="bg-grey-3">
            <q-toggle
                v-model="isWYSIWYG"
                color="secondary"
                title="isWYSIWYG"
                checked-icon="edit"
                unchecked-icon="code"
            />
            <q-space/>
            a
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

export default {
  name: "Detail",
  data() {
    return {
      isWYSIWYG: true,
      editing: {
        title: ''
      }
    }
  },
  computed: {
    isEntryOpen: () => store.getters.isEntryOpen,
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
          title: nv.fields.Title
        }
        this.editor && this.editor.setValue(nv.fields.Notes)
      },
      immediate: true,
    },
    isWYSIWYG(nv) {
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
  },
  beforeDestroy() {
    this.syncNotes()
    bus.$off(BUS_SAVE_NOTES_START)
    this.currentEntry = null
  },
  methods: {
    getIcon(index) {
      return icons.getByIndex(index)
    },
    initHyperMD() {
      const myTextarea = document.getElementById('input-area')
      const editor = HyperMD.fromTextArea(myTextarea, {})
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
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
