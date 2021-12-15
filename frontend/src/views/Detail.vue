<template>
  <div class="detail-view flex items-center justify-center">
    <TkCard solid class="edit-card">
      <div class="title-row flex">
        <ItemIcon
          :item="editData"
          class="cursor-pointer"
          :title="`${$t('preview')} (Ctrl+/)`"
          @click.native="handlePreview"
        />

        <TkInput
          v-model="editData.title"
          placeholder="Title"
          class="title-input"
          size="lg"
        />

        <TkButton
          round
          size="xs"
          class="material-icons"
          @click="showSettings"
        >settings
        </TkButton>
      </div>

      <div class="settings-row">
        <span class="date-text">{{ $t('home.created') }}: {{ formatDate(editData.creationTime) }}</span>


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

      </div>

      <div class="editor-wrap">
        <TkInput
          v-if="useSimpleEditor"
          v-model="simpleEditorValue"
          type="textarea"
          class="simple-editor"
          :style="simpleEditorStyle"
          @input="isChanged = true"
        />
        <DetailEditor
          v-else
          ref="codeEditor"
          :font-size="editorFontSize"
          :font-family="editorFontFamily"
          @onChange="isChanged = true"
        />
      </div>
    </TkCard>

    <DialogEntryPreview
      :visible.sync="isShowPreview"
      :item="previewItem"
    />

    <EditorSettings :visible.sync="isShowEditorSettings"/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import mainBus, {BUS_SYNC_ENTRY_DETAIL} from '@/utils/bus'
import {formatDate} from '@/utils'
import ItemIcon from '@/components/ItemIcon.vue'
import {getEntryDetail, updateEntry} from '@/api'
import DialogEntryPreview from '@/components/DialogEntryPreview.vue'
import EditorSettings from '@/components/EditorSettings'
import DetailEditor from '@/components/DetailEditor'
import {textFilters as filters} from '@/enum'

export default {
  name: 'Detail',
  components: {
    ItemIcon,
    DialogEntryPreview,
    EditorSettings,
    DetailEditor
  },
  data() {
    return {
      editData: {
        icon: null,
        bgColor: null,
        fgColor: null,
        title: '',
        creationTime: '',
      },
      isDisableEsc: false,
      isLoading: false,
      isShowPreview: false,
      isShowEditorSettings: false,
      previewItem: null,
      simpleEditorValue: ''
    }
  },
  computed: {
    ...mapGetters([
      'isDarkMode',
      'editorFontFamily',
      'useSimpleEditor',
    ]),
    isChanged: {
      get() {
        return this.$store.state.isChanged
      },
      set(val) {
        this.$store.commit('setIsChanged', val)
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
    uuid() {
      return this.$route.params.uuid
    },
    lockEsc() {
      return this.isShowPreview
    },
    simpleEditorStyle() {
      if (!this.useSimpleEditor) {
        return null
      }
      return {
        fontSize: this.editorFontSize + 'px',
        fontFamily: this.editorFontFamily
      }
    }
  },
  watch: {
    editData: {
      handler() {
        if (this.isLoading) {
          return
        }
        this.isChanged = true
      },
      deep: true
    },
    useSimpleEditor(val) {
      this.initEntryData()
      if (!val) {
        this.simpleEditorValue = null
      }
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
        this.editData.icon = entry.icon
        this.editData.bgColor = entry.bgColor
        this.editData.fgColor = entry.fgColor

        const editorValue = entry && entry.notes || ''

        if (!this.useSimpleEditor) {
          this.$refs.codeEditor.initCodeEditor(editorValue)
        } else {
          this.simpleEditorValue = editorValue
        }
      } catch (e) {
        console.error(e)
        this.$toast.error({message: e})
      } finally {
        this.$nextTick(() => {
          this.isLoading = false
        })
      }
    },
    getEditorValue() {
      if (this.useSimpleEditor) {
        return this.simpleEditorValue
      } else {
        return this.$refs.codeEditor.getValue()
      }
    },
    async syncNotes() {
      console.log('syncNotes1', this.uuid)

      if (!this.uuid) {
        return
      }
      const res = await updateEntry({
        uuid: this.uuid,
        updates: [
          {path: 'fields.Title', value: this.editData.title},
          {path: 'fields.Notes', value: this.getEditorValue() },
        ]
      })
      console.log('syncNotes2', res)
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
    async handlePreview() {
      await this.syncNotes()

      this.isShowPreview = true
      this.previewItem = await getEntryDetail(this.uuid)
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
        let fontSize = this.editorFontSize
        if (event.deltaY > 0) {
          if (fontSize <= 0) {
            return
          }
          fontSize -= 1
        } else {
          fontSize += 1
        }
        this.editorFontSize = fontSize
      }
    },
    showSettings() {
      this.syncNotes()
      this.isShowEditorSettings = true
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-view {
  height: 100%;
  overflow: auto;

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
    margin-top: 10px;
    margin-bottom: 10px;

    .date-text {
      font-size: 12px;
      opacity: .5;
    }
  }

  .title-row {
    display: flex;
    align-items: center;

    .title-input {
      margin-left: 10px;
      margin-right: 10px;
      flex: 1;
      font-size: inherit;
    }
  }

  .editor-wrap {
    //overflow: auto;
    height: calc(100vh - 220px);
    @media screen and (max-width: $mq_mobile_width) {
      height: calc(100vh - 140px);
      min-height: 100px;
      padding-bottom: 10px;
    }

    .simple-editor {
      width: 100%;
      height: 100%;
      resize: none;
    }
  }
}
</style>
