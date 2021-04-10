<template>
  <div class="group-tree-wrap">
    <q-tree
        :nodes="groupTree"
        node-key="id"
        label-key="title"
        selected-color="primary"
        :selected.sync="selectedGroupUuidStr"
        default-expand-all
    >
      <template v-slot:default-header="prop">
        <div class="row items-center">
          <IconShow
              class="tree-icon"
              :item="prop.node"
          />
          <div class="tree-name">{{ prop.node.title }}</div>
        </div>
        <slot v-bind:node="prop.node"></slot>
      </template>
    </q-tree>
  </div>
</template>

<script>
import store from "@/store"
import {getGroupTree} from "@/utils/kdbx-utils"
import IconShow from "@/components/IconShow"

export default {
  name: "GroupTree",
  components: {
    IconShow
  },
  props: {
    selectedGroupUuid: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      groupTree: [],
      selectedGroupUuidStr: null,
    }
  },
  computed: {
    database: {
      get: () => store.getters.database
    },
    groupUuidMap() {
      const groupTree = this.groupTree

      function getMap(node, counter = 0, map = {}) {
        if (!node || node.length === 0) return map

        node.forEach(item => {
          const children = item.children
          const uuidStr = item.uuid.id
          map[uuidStr] = item.uuid

          getMap(children, counter + 1, map)
        })

        return map
      }

      return getMap(groupTree)
    },
    mSelectedGroupUuid: {
      get() {
        return this.selectedGroupUuid
      },
      set(nv) {
        this.$emit('update:selectedGroupUuid', nv)
      }
    }
  },
  watch: {
    database: {
      handler(db) {
        if (!db) {
          this.groupTree = []
          return
        }

        this.refreshGroupTree()
      },
      immediate: true
    },
    selectedGroupUuidStr: {
      handler(nv) {
        if (!nv) {
          this.mSelectedGroupUuid = null
          return
        }
        this.mSelectedGroupUuid = this.groupUuidMap[this.selectedGroupUuidStr]
      },
      immediate: true
    },
  },
  methods: {
    refreshGroupTree() {
      this.groupTree = getGroupTree(this.database.groups)

      // re-open last group
      if (this.mSelectedGroupUuid) {
        this.selectedGroupUuidStr = this.mSelectedGroupUuid.id
        return
      }
      if (this.groupTree[0]) {
        this.selectedGroupUuidStr = this.groupTree[0].id
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.group-tree-wrap {
  .tree-icon {
    border-radius 0
    margin-right: 8px
  }

  >>> .q-tree__node--selected {
    box-shadow 0 0 1px 1px $primary inset
  }

  .text-primary {
    .tree-name {
    }
  }
}

</style>
