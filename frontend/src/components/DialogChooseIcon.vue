<template>
  <div>
    <TkModalDialog
      v-model="mVisible"
      show-close
    >
      <TkCard v-if="mVisible" padding="none" class="card-choose-icon">
        <div class="settings-form">
          <div class="settings-title">
            <div class="flex items-center">
              <ItemIcon
                  :item="{icon:index}"
              />
              <span class="">{{ $t('choose-icon') }}</span>
            </div>
          </div>

          <div class="settings-content">
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
          </div>
        </div>

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
import ItemIcon from './ItemIcon.vue'
import DialogPreview from './DialogPreview.vue'

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
  overflow: hidden;
  .settings-title {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .settings-content {
    padding: 0;
  }

  .icon-palette {
    max-height: 60vh;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    padding: 10px 10px;

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
