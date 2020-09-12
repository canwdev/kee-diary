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

              <EntryContextMenu

              />
            </template>
          </q-tree>
        </div>

      </template>

      <template v-slot:after>
        <EntryList
            :database="database"
            :entry-list="entryList"
            @onRefresh="handleRefreshEntryList"
        />

        <div style="height: 80px"></div>
      </template>

    </q-splitter>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="secondary" @click="handleAddEntry" title="Add entry"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import store from "@/store"
import {getGroupTree, getGroupEntries, addEntry} from "@/utils/kdbx-utils"
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
      selectedGroupUUIDStr: null,
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
    },
    currentGroupUUID: {
      get: () => store.getters.currentGroupUUID,
      set: val => store.commit('setCurrentGroupUUID', val)
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
        if (this.currentGroupUUID) {
          this.selectedGroupUUIDStr = this.currentGroupUUID.id
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
          this.entryList = []
          return
        }
        this.currentGroupUUID = this.groupUUIDMap[this.selectedGroupUUIDStr]
        this.handleRefreshEntryList()
      },
      immediate: true
    }
  },
  methods: {
    handleAddEntry() {
      const res = addEntry(this.database, this.currentGroupUUID)
      if (res) {
        this.$router.push({
          name: 'Detail'
        })
      }
    },
    handleRefreshEntryList() {
      if (!this.database) {
        this.entryList = []
        return
      }
      // console.log('selectedGroupUUIDStr', nv)
      this.entryList = getGroupEntries(this.database, this.currentGroupUUID)
      // console.log(this.entryList)
    }
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
