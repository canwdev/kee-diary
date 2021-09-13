<template>
  <div class="group-tree-wrap">
    <TkTree
      :nodes="treeData"
      :selected-id="mSelected && mSelected.id"
      @onItemClick="handleNodeClick"
    >
      <template v-slot:icon="{data: {item}}">
        <ItemIcon
          :item="item && item.data"
        />
      </template>

    </TkTree>
  </div>
</template>

<script>
import {getGroupTree} from '../api'
import ItemIcon from '@/components/ItemIcon'

// TODO
const TreeNode = window.tankUI.default.enum.TreeNode

export default {
  name: 'GroupTree',
  components: {
    ItemIcon
  },
  props: {
    selected: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      treeData: {},
      self_selected: null
    }
  },
  computed: {
    mSelected: {
      get() {
        return this.selected || this.self_selected
      },
      set(val) {
        this.$emit('update:selected', val)
        this.$emit('onSelect', val)
        this.self_selected = val
      }
    }
  },
  watch: {},
  mounted() {
    this.getTree()
  },
  methods: {
    handleNodeClick(node) {
      this.mSelected = node
    },
    async getTree() {
      this.treeData = {}
      const res = await getGroupTree()
      if (res && res[0]) {
        // console.log(res[0])
        this.treeData = TreeNode.generateTree(res[0])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.group-tree-wrap {

}

</style>
