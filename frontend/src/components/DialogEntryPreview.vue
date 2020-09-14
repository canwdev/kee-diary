<template>
  <div>
    <q-dialog
        v-model="mVisible"
        transition-show="fade"
        transition-hide="fade"
    >
      <q-card v-if="entry" style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6 row items-center">
            <IconShow
                @click.native="previewBigIcon = true"
                class="cursor-pointer"
                :item="entry"
            />
            <span class="q-ml-md">{{ entry.fields.Title }}</span>
            <q-space/>
            <q-btn icon="close" flat round dense v-close-popup/>
          </div>
        </q-card-section>

        <q-separator/>

        <q-card-section style="max-height: 80vh" class="scroll">
          <q-card
              flat
              v-html="transformHTML(entry.fields.Notes)"
              :class="isDarkMode ? 'markdown-body-dark' : 'markdown-body'"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="previewBigIcon" transition-show="scale" transition-hide="scale">
      <q-card class="q-pa-lg">

        <q-card-section class="q-pa-lg text-center">
          <IconShow
              size="256px"
              :item="entry"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import markdownIt from "@/utils/markdown-it"
import store from "@/store"
import IconShow from "@/components/IconShow"

export default {
  name: "DialogEntryPreview",
  components: {
    IconShow
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
      previewBigIcon: false
    }
  },
  methods: {
    transformHTML(text) {
      return markdownIt.render(text)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
