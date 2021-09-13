<template>
  <div>
    <TkModalDialog
      v-model="mVisible"
      show-close
    >
      <TkCard v-if="item" style="width: 700px; max-width: 80vw;">
        <div class="flex items-center justify-between">
          <ItemIcon
            class="cursor-pointer"
            :item="item"
            @click.native="isShowPreviewIcon = true"
          />
          <span class="q-ml-md" @dblclick="logEntry">{{ item.title }}</span>

          <span></span>
        </div>

        <hr/>

        <div class="flex justify-between">
          <span>{{ $t('home.created') }}: {{ formatDate(item.creationTime) }}</span>
          <span>{{ $t('home.modified') }}: {{ formatDate(item.lastModTime) }}</span>
        </div>

        <hr/>

        <div
          :class="isDarkMode ? 'markdown-body-dark' : 'markdown-body'"
          v-html="transformHTML(item.notes || '')"
        />
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
import marked from '@/utils/marked'
import {formatDate} from '@/utils'
import store from '@/store'
import ItemIcon from '@/components/ItemIcon'
import DialogPreview from './DialogPreview'

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
  computed: {
    isDarkMode: {
      get: () => store.getters.isDarkMode,
    },
    mVisible: {
      get() {
        return this.visible
      },
      set(nv) {
        this.$emit('update:visible', nv)
      }
    }
  },
  data() {
    return {
      isShowPreviewIcon: false
    }
  },
  methods: {
    formatDate,
    transformHTML(text) {
      return marked(text)
    },
    logEntry() {
      console.log(this.item)
    }
  }
}
</script>

