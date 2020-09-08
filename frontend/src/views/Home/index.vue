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
            </template>
          </q-tree>
        </div>

      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <q-table
              dense
              :data="entryList"
              :columns="entryTableColumns"
              row-key="id"
              :pagination.sync="pagination"
              selection="multiple"
              :selected-rows-label="getSelectedString"
              :selected.sync="selected"
              @row-click="handleRowClick"
          >
            <template v-slot:body-cell-title="props">
              <q-td
                  :props="props"
              >
                <q-avatar
                    @click.stop="handleIconClick(props.row)"
                    size="32px" square>
                  <img :src="icons[props.row.iconIndex]">
                </q-avatar>
                <span class="q-ml-md">{{ props.row.title }}</span>
              </q-td>
            </template>
          </q-table>
        </div>
      </template>

    </q-splitter>

    <DialogChooseIcon
      :visible.sync="isDialogChooseIconVisible"
      :index="currentEntry.iconIndex"
      @onChoose="updateEntryIcon"
    />
  </q-page>
</template>

<script>
import store from "@/store"
import {getGroupTree, getGroupEntries} from "@/utils/kdbx-utils"
import {formatDateLite} from "@/utils"
import DialogChooseIcon from "@/components/DialogChooseIcon.vue"
import icons from "@/assets/db-icons"

export default {
  name: "DbListView",
  components: {
    DialogChooseIcon
  },
  data() {
    return {
      splitterModel: 30,
      groupTree: [],
      selectedGroup: null,
      entryList: [],
      entryTableColumns: Object.freeze([
        // {name: 'star', align: 'center', label: '★', field: 'iconImg'},
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
      selected: [],
      icons: Object.freeze(icons.items),
      isDialogChooseIconVisible: false,
      currentEntry: {}
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
      this.isDialogChooseIconVisible = true
      this.currentEntry = row
    },
    updateEntryIcon(iconIndex) {
      this.currentEntry.iconIndex = iconIndex
      this.currentEntry._entry.icon = iconIndex
      store.commit('setIsNotSave')
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
