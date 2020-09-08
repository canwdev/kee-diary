<template>
  <q-page>
    <q-splitter
        v-model="splitterModel"
    >
      <template v-slot:before>
        <div class="q-pa-md">
          <q-tree
              :nodes="groupTree"
              node-key="id"
              label-key="name"
              selected-color="primary"
              :selected.sync="selectedGroup"
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
              <EntryContextMenu/>
            </template>
          </q-tree>
        </div>

      </template>

      <template v-slot:after>
        <EntryList
            :entry-list="entryList"
        />
      </template>

    </q-splitter>


  </q-page>
</template>

<script>
import store from "@/store"
import {getGroupTree, getGroupEntries} from "@/utils/kdbx-utils"
import icons from "@/assets/db-icons"
import EntryContextMenu from "@/components/EntryContextMenu"
import EntryList from "@/views/Home/EntryList"

export default {
  name: "DbListView",
  components: {
    EntryList,
    EntryContextMenu
  },
  data() {
    return {
      splitterModel: 30,
      groupTree: [],
      selectedGroup: null,
      entryList: [],
      icons: Object.freeze(icons.items)
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

      const map = getMap(groupTree)
      // console.log('groupUUIDMap', map)
      return map
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

        if (this.groupTree[0]) {
          this.selectedGroup = this.groupTree[0].id
        }
      },
      immediate: true
    },
    selectedGroup: {
      handler(nv) {
        if (!nv || !this.database) {
          this.entryList = []
          return
        }
        const groutUUIDObject = this.groupUUIDMap[nv]
        this.entryList = getGroupEntries(this.database, groutUUIDObject)
        // console.log(this.entryList)
      },
      immediate: true
    }
  },
  methods: {
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
  }
}
</style>
