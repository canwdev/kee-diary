<template>
  <q-tree
      :nodes="groupTree"
      node-key="id"
      label-key="name"
      selected-color="primary"
      :selected.sync="selectedGroupUUIDStr"
      default-expand-all
  >
    <template v-slot:default-header="prop">
      <div class="row items-center">
        <q-avatar
            class="tree-icon"
            size="32px" square>
          <img :src="icons[prop.node.iconIndex]">
        </q-avatar>
        <div class="tree-name">{{ prop.node.name }}</div>
      </div>
    </template>
  </q-tree>
</template>

<script>
import icons from "@/assets/db-icons"
import store from "@/store"
import {getGroupTree} from "@/utils/kdbx-utils"

export default {
  name: "GroupTree",
  props: {
    selectedGroupUUID: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      icons: Object.freeze(icons.items),
      groupTree: [],
      selectedGroupUUIDStr: null,
    }
  },
  computed: {
    database: {
      get: () => store.getters.database
    },
    groupUUIDMap() {
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
    mSelectedGroupUUID: {
      get() {
        return this.selectedGroupUUID
      },
      set(nv) {
        this.$emit('update:selectedGroupUUID', nv)
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

        this.groupTree = getGroupTree(db.groups)

        // re-open last group
        if (this.mSelectedGroupUUID) {
          this.selectedGroupUUIDStr = this.mSelectedGroupUUID.id
          return
        }
        if (this.groupTree[0]) {
          this.selectedGroupUUIDStr = this.groupTree[0].id
        }
      },
      immediate: true
    },
    selectedGroupUUIDStr: {
      handler(nv) {
        if (!nv) {
          this.mSelectedGroupUUID = null
          return
        }
        this.mSelectedGroupUUID = this.groupUUIDMap[this.selectedGroupUUIDStr]
        // this.handleRefreshEntryList()
      },
      immediate: true
    },
  }
}
</script>

<style lang="stylus" scoped>
.tree-icon {
  border-radius 0
  margin-right: 8px
}

.text-primary {
  .tree-name {
    font-weight: bold;
    text-decoration: underline
  }
}
</style>
