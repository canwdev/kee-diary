<template>
  <TkModalDialog
    v-model="mVisible"
    show-close
  >
    <TkCard padding="none" class="card-choose-group">
      <div class="settings-form">
        <div class="settings-title">
          <span>{{ $t('choose-group') }}</span>
        </div>

        <div class="settings-content">
          <div class="card-tree">
            <p v-if="tips" class="text-weight-thin">{{ $t('tip') }}: {{
                tips
              }}</p>
            <GroupTree
                ref="treeRef"
                :selected.sync="selected"
            />
          </div>
        </div>
      </div>

      <div class="action-btn-row">
        <TkButton flat :label="$t('cancel')" @click="mVisible = false"/>
        <TkButton
          :disabled="!selected"
          :label="$t('choose')"
          @click="handleChoose"
        />
      </div>
    </TkCard>
  </TkModalDialog>
</template>

<script>
import GroupTree from '@/components/GroupTree.vue'

const checkParent = (node, uuid) => {
  if (!node) {
    return false
  }
  if (uuid === node.data.uuid) {
    return true
  }
  if (node.parent) {
    return checkParent(node.parent, uuid)
  }
  return false
}

export default {
  name: 'DialogChooseGroup',
  components: {
    GroupTree
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tips: {
      type: String,
      default: null
    },
    autoExpandUuid: {
      type: String,
      default: null
    },
    notAllowSelectSub: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      selected: null
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
    mVisible: {
      handler(val) {
        if (val && this.autoExpandUuid) {
          // console.log('autoExpandUuid', this.autoExpandUuid)
          this.$nextTick(() => {
            this.expandNodeByUuid(this.autoExpandUuid)
          })
        }
      }
    }
  },
  methods: {
    updateTree() {
      this.$refs.treeRef.getTreeData()
    },
    handleChoose() {
      if (this.notAllowSelectSub) {
        const isSub = checkParent(this.selected, this.autoExpandUuid)
        if (isSub) {
          if (this.tips) {
            this.$toast.warning(this.tips)
          }
          return
        }
      }
      this.$emit('onChoose', this.selected)
    },
    expandNodeByUuid(uuid) {
      const node = this.$refs.treeRef.findNode(uuid)
      console.log('node', node)
      if (!node) {
        return
      }
      node.$click()
      this.$refs.treeRef.openNode(node)
    }
  }
}
</script>

<style lang="scss" scoped>
.card-choose-group {

  .card-tree {
    max-height: 70vh;
    overflow: auto;
  }

}
</style>

