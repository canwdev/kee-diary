<template>
  <div class="group-view">
    <GroupTree
      ref="treeRef"
      :selected.sync="mSelected"
      @onItemContextMenu="handleContextMenu"
    >
    </GroupTree>

    <ContextMenuCommon
      ref="ctxMenu"
      :is-group="true"
      :hidden-items="['preview', 'edit', 'changeColor']"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import GroupTree from '@/components/GroupTree.vue'
import ContextMenuCommon from '@/components/ContextMenuCommon.vue'

export default {
  name: 'GroupView',
  components: {
    GroupTree,
    ContextMenuCommon
  },
  props: {
    selected: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
    }
  },
  computed: {
    mSelected: {
      get() {
        return this.selected
      },
      set(val) {
        this.$emit('update:selected', val)
      }
    }
  },
  methods: {
    updateTree() {
      this.$refs.treeRef.getTreeData()
    },
    handleContextMenu({item}) {
      // console.log('handleContextMenu', item)
      this.$refs.ctxMenu.open(item)
    }
  }
}
</script>

<style lang="scss" scoped>
.group-view {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>

