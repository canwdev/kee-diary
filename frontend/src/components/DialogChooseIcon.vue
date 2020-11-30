<template>
  <q-dialog
      v-model="mVisible"
      transition-show="fade"
      transition-hide="fade"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6 row items-center">
          <IconShow
              :item="{icon:index}"
          />
          <span class="q-ml-md">{{$t('choose-icon')}}</span>
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-section style="max-height: 70vh" class="scroll">
        <q-card flat class="q-gutter-md">
          <q-btn
              v-for="(item, i) in icons"
              :key="i"
              @click="handleSelect(i)"
              @contextmenu="handlePreview(i)"
              :flat="i !== selectedIndex"
              color="primary"
              round
          >
            <IconShow
                :item="{icon:i}"
                :icon-scale="1"
            />
            <q-tooltip>
              {{ item.name }}
            </q-tooltip>
          </q-btn>
        </q-card>
      </q-card-section>

      <q-separator/>

      <q-card-actions align="right">
        <q-btn flat :label="$t('cancel')" color="primary" v-close-popup/>
        <q-btn
            :disabled="index === selectedIndex"
            @click="handleChoose"
            flat :label="$t('choose')" color="primary"/>
      </q-card-actions>
    </q-card>

    <DialogPreview
        :visible.sync="isPreviewIconVisible"
    >
      <IconShow
          size="256px"
          :item="{icon:previewIndex}"
          :icon-scale="1"
      />
    </DialogPreview>
  </q-dialog>
</template>

<script>
import icons from '@/assets/db-icons'
import IconShow from "./IconShow"
import DialogPreview from "./DialogPreview"

export default {
  components: {
    IconShow,
    DialogPreview
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: null
    }
  },
  computed: {
    mVisible: {
      get() {
        return this.visible
      },
      set(nv) {
        this.$emit('update:visible', nv)
      }
    }
  },
  watch: {
    index: {
      handler(nv) {
        this.selectedIndex = nv
      },
      immediate: true
    }
  },
  data() {
    return {
      icons: Object.freeze(icons.list),
      selectedIndex: null,
      previewIndex: null,
      isPreviewIconVisible: false
    }
  },
  methods: {
    handleChoose() {
      this.$emit('onChoose', this.selectedIndex)
      this.mVisible = false
    },
    handleSelect(i) {
      if (this.selectedIndex === i) {
        this.handleChoose()
      } else {
        this.selectedIndex = i
      }
    },
    handlePreview(i) {
      this.previewIndex = i
      this.isPreviewIconVisible = true
    }
  }
}
</script>
