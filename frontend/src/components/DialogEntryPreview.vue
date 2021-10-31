<template>
  <div class="dialog-entry-preview">
    <TkModalDialog
      v-model="mVisible"
      show-close
    >
      <TkCard v-if="previewItem" style="width: 700px; max-width: 80vw;" class="preview-container">
        <div class="preview-head">
          <div class="flex items-center justify-between">
            <ItemIcon
              class="cursor-pointer"
              :item="previewItem"
              @click.native="isShowPreviewIcon = true"
            />
            <span class="_title" @dblclick="logEntry">{{ previewItem.title }}</span>

            <span></span>
          </div>

          <hr/>

          <div class="flex justify-between">
            <span>{{ $t('home.created') }}: {{ formatDate(previewItem.creationTime) }}</span>
            <span>{{ $t('home.modified') }}: {{ formatDate(previewItem.lastModTime) }}</span>
          </div>

          <hr/>
        </div>

        <div class="preview-body">
          <div
            :class="isDarkMode ? 'markdown-body-dark' : 'markdown-body'"
            v-html="transformHTML(previewItem.notes || '')"
          />
        </div>

      </TkCard>
    </TkModalDialog>

    <DialogPreview
      :visible.sync="isShowPreviewIcon"
    >
      <ItemIcon
        size="256px"
        :item="item"
      />
    </DialogPreview>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import marked from '@/utils/marked'
import {formatDate} from '@/utils'
import {getEntryDetail} from '@/api'
import ItemIcon from '@/components/ItemIcon.vue'
import DialogPreview from './DialogPreview.vue'

export default {
  name: 'DialogEntryPreview',
  components: {
    ItemIcon,
    DialogPreview,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isShowPreviewIcon: false,
      pItem: null
    }
  },
  computed: {
    ...mapGetters([
      'isDarkMode'
    ]),
    mVisible: {
      get() {
        return this.visible
      },
      set(nv) {
        this.$emit('update:visible', nv)
      }
    },
    previewItem() {
      return this.pItem || this.item
    }
  },
  watch: {
    item: {
      async handler(val) {
        this.pItem = null
        if (!val) {
          return
        }
        this.pItem = await getEntryDetail(val.uuid)
      },
      immediate: true
    }
  },
  methods: {
    formatDate,
    transformHTML(text) {
      return marked(text)
    },
    logEntry() {
      console.log(this.previewItem)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-entry-preview {

  .preview-container {
    display: flex;
    flex-direction: column;
    max-height: 80vh;
    overflow: hidden;

    .preview-head {
      ._title {
        font-weight: bold;
        font-size: 18px;
      }
    }

    .preview-body {
      flex: 1;
      overflow: auto;
      padding: 20px 20px;
    }
  }
}
</style>
