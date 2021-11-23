<template>
  <div class="dialog-entry-preview">
    <TkModalDialog
      v-model="mVisible"
      show-close
    >
      <TkCard v-if="previewItem" padding="none" class="preview-container">
        <div class="settings-form">
          <div class="preview-head">
            <div class="settings-title">

              <div class="flex items-center">
                <ItemIcon
                  class="cursor-pointer"
                  :item="previewItem"
                  @click.native="isShowPreviewIcon = true"
                />
                <span class="_title" @dblclick="logEntry">{{ previewItem.title }}</span>

                <span></span>
              </div>

            </div>

            <div class="row-datetime">
              <span>{{ $t('home.created') }}: {{ formatDate(previewItem.creationTime) }}</span>
              <span>{{ $t('home.modified') }}: {{ formatDate(previewItem.lastModTime) }}</span>
            </div>

          </div>
          <div class="preview-body">
            <div
              :class="isDarkMode ? 'markdown-body-dark' : 'markdown-body'"
              v-html="transformHTML(previewItem.notes || '')"
            />
          </div>
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
  .settings-form {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 80vh;

    width: auto;
    max-width: 1200px;

    @media screen and (max-width: $mq_mobile_width) {
      max-width: 90vw;
    }

    .preview-head {
      .settings-title {
        padding-top: 10px;
        padding-bottom: 10px;
      }
      ._title {
        font-weight: bold;
        font-size: 18px;
        margin-left: 5px;
      }

      .row-datetime {
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 15px;
        border-bottom: 1px solid $border-color;
      }
    }

    .preview-body {
      flex: 1;
      overflow: auto;
      padding: 10px 15px;
    }
  }

}
</style>
