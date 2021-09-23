<template>
  <div>
    <TkModalDialog
      v-model="mVisible"
      show-close
    >
      <TkCard class="card-choose-icon">
        <div class="flex items-center">
          <ItemIcon
            :item="{icon:index}"
          />
          <span class="">{{ $t('choose-icon') }}</span>
        </div>

        <hr/>

        <div class="icon-palette">
          <TkButton
            v-for="(item, i) in icons"
            :key="i"
            :title="item.name"
            size="no-style"
            class="icon-item"
            :class="{active: i === selectedIndex }"
            @click="handleSelect(i)"
            @contextmenu="handlePreview(i)"
          >
            <ItemIcon
              :item="{icon:i}"
              :icon-scale="1.2"
            />
          </TkButton>
        </div>

        <hr/>
        <div class="action-btn-row">
          <TkButton :label="$t('cancel')" @click="mVisible = false"/>
          <TkButton
            :disabled="index === selectedIndex"
            :label="$t('choose')"

            @click="handleChoose"
          />
        </div>
      </TkCard>

    </TkModalDialog>

    <DialogPreview
      :visible.sync="isPreviewIconVisible"
    >
      <ItemIcon
        size="256px"
        :item="{icon:previewIndex}"
        :icon-scale="1"
      />
    </DialogPreview>
  </div>
</template>

<script>
import icons from '@/assets/db-icons'
import ItemIcon from './ItemIcon'
import DialogPreview from './DialogPreview'

export default {
  components: {
    ItemIcon,
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
    },
    mVisible(val) {
      if (!val) {
        this.selectedIndex = this.index
      }
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

<style lang="scss" scoped>
.card-choose-icon {
  max-width: 500px;

  .icon-palette {
    max-height: 70vh;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    padding: 10px 0;

    .icon-item {
      margin: 5px;
      padding: 2px;

      &.active {
        outline: 2px dashed $primary;
      }
    }
  }
}
</style>
