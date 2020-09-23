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
                @click.native="isPreviewIconVisible = true"
                class="cursor-pointer"
                :item="entry"
            />
            <span class="q-ml-md">{{ entry.fields.Title }}</span>
            <q-space/>
            <q-btn icon="close" flat round dense v-close-popup/>
          </div>
        </q-card-section>

        <q-separator/>

        <q-card-section style="max-height: 78vh" class="scroll">
          <q-card
              flat
              v-html="transformHTML(entry.fields.Notes)"
              :class="isDarkMode ? 'markdown-body-dark' : 'markdown-body'"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

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
import marked from "@/utils/marked"
import store from "@/store"
import IconShow from "@/components/IconShow"
import DialogPreview from "./DialogPreview"

export default {
  name: "DialogPreviewEntry",
  components: {
    IconShow,
    DialogPreview
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
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
