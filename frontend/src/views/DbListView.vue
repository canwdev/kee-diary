<template>
  <q-page>
    <q-splitter
        v-model="splitterModel"
    >
      <template v-slot:before>
        <div class="q-pa-md">
          <q-btn color="primary" @click="handleLog">log</q-btn>
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
              :title="selectedGroup"
              :data="entryList"
              :columns="entryTableColumns"
              row-key="name"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="star" :props="props">
                  <img class="icon-img" :src="props.row.iconImg"/>
                </q-td>
                <q-td key="title" :props="props">
                  {{ props.row.title }}
                </q-td>
                <q-td key="creationTime" :props="props">
                  {{ formatDateLite(props.row.creationTime) }}
                </q-td>
                <q-td key="lastModTime" :props="props">
                  {{ formatDateLite(props.row.lastModTime) }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </template>

    </q-splitter>


  </q-page>
</template>

<script>
import store from "@/store"
import {getGroupTree, getGroupEntries} from "../utils/kdbx-utils"
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
        // {
        //   name: 'name',
        //   required: true,
        //   label: 'Dessert (100g serving)',
        //   align: 'left',
        //   field: row => row.name,
        //   format: val => `${val}`,
        //   sortable: true
        //   sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        // },
        {name: 'star', align: 'center', label: '★', field: 'iconImg'},
        {name: 'title', align: 'left', label: 'Title', field: 'title', sortable: true},
        {
          name: 'creationTime', align: 'center', label: 'Created', field: 'creationTime', sortable: true
        },
        {
          name: 'lastModTime', align: 'center', label: 'Modified', field: 'lastModTime', sortable: true
        },
      ])
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
      },
      immediate: true
    }
  },
  methods: {
    formatDateLite,
    handleLog() {
      console.log(this.database)
    }
  }
}
</script>

<style lang="stylus" scoped>
>>> .q-tree__img, .icon-img {
  height 32px
}
</style>
