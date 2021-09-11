<template>
  <TkModalDialog
    v-model="mVisible"
  >
    <TkCard>
      <TkCard>
        <div class="text-h6 row items-center">
          <IconShow
            :item="{icon:index}"
          />
          <span class="q-ml-md">{{ $t('choose-icon') }}</span>
        </div>
      </TkCard>

      <q-separator/>

      <TkCard style="max-height: 70vh" class="scroll">
        <TkCard flat class="q-gutter-md">
          <TkButton
            v-for="(item, i) in icons"
            :key="i"
            :flat="i !== selectedIndex"
            color="primary"
            round
            @click="handleSelect(i)"
            @contextmenu="handlePreview(i)"
          >
            <IconShow
              :item="{icon:i}"
              :icon-scale="1"
            />
            <q-tooltip>
              {{ item.name }}
            </q-tooltip>
          </TkButton>
        </TkCard>
      </TkCard>

      <q-separator/>

      <TkCard>
        <TkButton v-close-popup flat :label="$t('cancel')" color="primary"/>
        <TkButton
          :disabled="index === selectedIndex"
          flat
          :label="$t('choose')"
          color="primary"
          @click="handleChoose"
        />
      </TkCard>
    </TkCard>

    <DialogPreview
      :visible.sync="isPreviewIconVisible"
    >
      <IconShow
        size="256px"
        :item="{icon:previewIndex}"
        :icon-scale="1"
      />
    </DialogPreview>
  </TkModalDialog>
</template>

<script>
import icons from '@/assets/db-icons'
import IconShow from './IconShow'
import DialogPreview from './DialogPreview'

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
