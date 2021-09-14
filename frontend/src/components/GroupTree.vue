<template>
  <div class="group-tree-wrap">
    <TkTree
      ref="treeRef"
      :nodes="treeData"
      :selected-id="mSelected && mSelected.id"
      @onItemClick="handleNodeClick"
    >
      <template v-slot:icon="{data: {item}}">
        <ItemIcon
          :item="item && item.data"
        />
        {{ item.id }}
      </template>

    </TkTree>
  </div>
</template>

<script>
import {getGroupTree} from '../api'
import ItemIcon from '@/components/ItemIcon'
import {getNodeUuid} from '@/utils'

// TODO
const TreeNode = window.tankUI.default.enum.TreeNode

const rootItem = new TreeNode()

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
      treeData: rootItem,
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
    this.getTreeData()
  },
  methods: {
    handleNodeClick(node) {
      this.mSelected = node
    },
    async getTreeData() {
      this.treeData = rootItem
      const uuid = getNodeUuid(this.mSelected)
      // console.log('uuid', this.mSelected, uuid)

      const res = await getGroupTree()
      if (res && res[0]) {
        this.treeData = TreeNode.generateTree(res[0])
      }
      this.$nextTick(() => {
        if (uuid) {
          const node = this.getNodeByUuid(this.treeData, uuid)
          console.log('node', node)
          if (node) {
            node.$click()
            this.openNode(node)
            return
          }
        }
        this.$refs.treeRef.getRootItem().handleClick()
      })
    },
    getNodeByUuid(node, uuid, deep = 0) {
      deep++
      console.log('getNodeByUuid', node, node.id, deep)
      if (!node || !uuid) {
        return null
      }
      const uid = getNodeUuid(node)
      if (uid === uuid) {
        console.log('found1', node.id)
        return node
      }
      if (node.children) {
        const len = node.children.length
        for (let i = 0; i < len; i++) {
          const n = node.children[i]
          const result = this.getNodeByUuid(n, uuid)
          if (result) {
            return result
          }
        }
      }
      return null
    },
    openNode(node) {
      node.isOpen = true
      if (node.parent) {
        this.openNode(node.parent)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.group-tree-wrap {

}

</style>
