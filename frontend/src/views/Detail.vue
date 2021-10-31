<template>
  <div class="detail-view flex items-center justify-center">
    <TkCard solid class="edit-card">
      <div class="title-row flex">
        <ItemIcon
            class="cursor-pointer"
        >
          {{ $t('preview') + '1' }} (Ctrl+/)
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

      <div class="editor-wrap">
        <div id="code-container" style="height:100%;"></div>
      </div>
    </TkCard>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import * as monaco from 'monaco-editor'

import mainBus, {BUS_SYNC_ENTRY_DETAIL} from '@/utils/bus'
import {formatDate} from '@/utils'
import ItemIcon from '@/components/ItemIcon.vue'
import {getEntryDetail, updateEntry} from '@/api'

import {textFilters as filters} from '@/enum'

const themeOptions = [
  'vs',
  'vs-dark',
  'hc-black'
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
    ...mapGetters([
      'isDarkMode'
    ]),
    isChanged: {
      get() {
        return this.$store.state.isChanged
      },
      set(val) {
        this.$store.commit('setIsChanged', val)
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
    editorFontSize: {
      get() {
        return this.$store.getters.editorFontSize
      },
      set(val) {
        this.$store.commit('setEditorFontSize', val)
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
    uuid() {
      return this.$route.params.uuid
    }
  },
  watch: {
    editorTheme(nv) {
      this.editor.updateOptions({
        theme: nv
      })
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
    window.addEventListener('resize', this.handleResize)
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
    window.removeEventListener('resize', this.handleResize)
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
        this.initCodeEditor(entry)
      } catch (e) {
        console.error(e)
        this.$toast.error({message: e})
      } finally {
        this.$nextTick(() => {
          this.isLoading = false
        })
      }
    },
    initCodeEditor(entry) {
      const container = document.getElementById('code-container')

      const value = entry && entry.notes || ''
      const editor = monaco.editor.create(container, {
        value,
        lineNumbers: 'off',
        language: 'markdown',
        theme: this.editorTheme,
        wordWrap: true,
        minimap: {
          enabled: false
        },
        scrollbar: {
          alwaysConsumeMouseWheel: false
        }
      })

      // editor.setSize(null, '100%') // set height
      // this.setFontFamily(editor)
      this.setFontSize(editor)

      editor.onDidChangeModelContent(event => {
        if (this.editor) {
          this.isChanged = true
        }
      })

      this.editor = editor
    },
    setFontSize(editor = this.editor) {
      editor.updateOptions({
        fontSize: this.editorFontSize
      })
    },
    setFontFamily(editor = this.editor) {
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
    },
    handleResize() {
      if (this.editor) {
        this.editor.layout()
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

  .editor-wrap {
    //overflow: auto;
    height: calc(100vh - 230px);
    @media screen and (max-width: $mq_mobile_width) {
      height: calc(100vh - 200px);
    }
  }
}
</style>
