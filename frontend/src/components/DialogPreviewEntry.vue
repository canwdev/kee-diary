<template>
  <div>
    <TkModalDialog
      v-model="mVisible"
    >
      <TkCard v-if="entry" style="width: 700px; max-width: 80vw;">
        <TkCard>
          <div class="text-h6 row items-center">
            <IconShow
              class="cursor-pointer"
              :item="entry"
              @click.native="isPreviewIconVisible = true"
            />
            <span class="q-ml-md" @dblclick="logEntry">{{ entry.fields.Title }}</span>
            <q-space/>
            <TkButton v-close-popup icon="close" flat round dense/>
          </div>
        </TkCard>

        <q-separator/>

        <TkCard class="q-py-sm flex justify-between">
          <span>{{ $t('home.created') }}: <DateTimeEdit disabled :date="entry.times.creationTime"/></span>
          <span>{{ $t('home.modified') }}: <DateTimeEdit disabled :date="entry.times.lastModTime"/></span>
        </TkCard>

        <q-separator/>

        <TkCard style="max-height: 78vh" class="scroll">
          <TkCard
            flat
            :class="isDarkMode ? 'markdown-body-dark' : 'markdown-body'"
            v-html="transformHTML(entry.fields.Notes)"
          />
        </TkCard>
      </TkCard>
    </TkModalDialog>

    <DialogPreview
      :visible.sync="isPreviewIconVisible"
    >
      <IconShow
        size="256px"
        :item="entry"
      />
    </DialogPreview>
  </div>
</template>

<script>
import marked from '@/utils/marked'
import store from '@/store'
import IconShow from '@/components/IconShow'
import DateTimeEdit from '@/components/DateTimeEdit'
import DialogPreview from './DialogPreview'

export default {
  name: 'DialogPreviewEntry',
  components: {
    IconShow,
    DialogPreview,
    DateTimeEdit
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    entry: {
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
      isPreviewIconVisible: false
    }
  },
  methods: {
    transformHTML(text) {
      return marked(text)
    },
    logEntry() {
      console.log(this.entry)
    }
  }
}
</script>

