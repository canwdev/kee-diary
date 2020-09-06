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
          />
        </div>

      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <q-table
              :data="entryList"
              :columns="entryTableColumns"
              row-key="id"
              :pagination.sync="pagination"
              selection="multiple"
              :selected-rows-label="getSelectedString"
              :selected.sync="selected"
              @row-click="handleRowClick"
          >
            <template v-slot:body-cell-star="props">
              <q-td
                  :props="props"
                  @click.stop="handleIconClick(props.row)"
              >
                <q-avatar size="32px" square>
                  <img :src="props.value">
                </q-avatar>
              </q-td>
            </template>
          </q-table>
        </div>
      </template>

    </q-splitter>


  </q-page>
</template>

<script>
import store from "@/store"
import {getGroupTree, getGroupEntries} from "../../utils/kdbx-utils"
import {formatDateLite} from "@/utils"

export default {
  name: "DbListView",
  data() {
    return {
      splitterModel: 30,
      groupTree: [],
      selectedGroup: null,
      entryList: [],
      entryTableColumns: Object.freeze([
        {name: 'star', align: 'center', label: '★', field: 'iconImg'},
        {name: 'title', align: 'left', label: 'Title', field: 'title', sortable: true},
        {
          name: 'creationTime',
          align: 'center',
          label: 'Created',
          field: 'creationTime',
          format: val => formatDateLite(val),
          sortable: true
        },
        {
          name: 'lastModTime',
          align: 'center',
          label: 'Modified',
          field: 'lastModTime',
          format: val => formatDateLite(val),
          sortable: true
        },
      ]),
      pagination: {
        rowsPerPage: 10
      },
      selected: []
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
    getSelectedString() {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''}`
    },
    handleRowClick(evt, row) {
      store.commit('setCurrentEntry', row._entry)
      this.$router.push({
        name: 'Detail'
      })
    },
    handleIconClick(row) {
      console.log(row)
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
