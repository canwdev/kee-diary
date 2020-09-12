<template>
  <div class="q-px-md q-py-sm q-pb-lg">
    <q-table
        dense
        :data="entryList"
        :columns="entryTableColumns"
        row-key="id"
        :pagination.sync="pagination"
        selection="multiple"
        :selected-rows-label="getSelectedString"
        :selected.sync="selected"
    >
      <template v-slot:body="props">
        <q-tr :props="props"
              @click="handleRowClick(props.row)"
              @contextmenu="handleRowContextMenu(props.row)">
          <q-td @click.stop="">
            <q-checkbox dense v-model="props.selected" color="secondary"/>
          </q-td>
          <q-td class="cursor-pointer" key="title" :props="props">
            <q-avatar
                @click.stop="handlePreview(props.row)"
                size="32px" square>
              <img :src="icons[props.row.iconIndex]">
            </q-avatar>
            <span class="q-ml-md">{{ props.row.title }}</span>
          </q-td>
          <q-td class="cursor-pointer" key="creationTime" :props="props">{{
              formatDateLite(props.row.creationTime)
            }}
          </q-td>
          <q-td class="cursor-pointer" key="lastModTime" :props="props">{{
              formatDateLite(props.row.lastModTime)
            }}
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <EntryContextMenu
        :target-data="selected"
        @onPreview="handlePreview"
        @onEdit="handleEdit"
        @onRename="handleRename"
        @onChangeIcon="handleChangeIcon"
        @onMove="handleShowChooseEntry"
        @onDelete="handleDelete"
    />

    <DialogEntryPreview
        :visible.sync="isDialogPreviewVisible"
        :entry="currentEntryWrap._entry"
    />

    <DialogChooseIcon
        :visible.sync="isDialogChooseIconVisible"
        :index="currentEntryWrap.iconIndex"
        @onChoose="updateEntryIcon"
    />

    <DialogChooseGroup
        :visible.sync="isDialogChooseGroupVisible"
        @onChoose="handleMoveEntry"
    />
  </div>
</template>

<script>
import {formatDateLite} from "@/utils"
import icons from "@/assets/db-icons"
import store from "@/store"
import EntryContextMenu from "@/components/EntryContextMenu"
import DialogEntryPreview from "@/components/DialogEntryPreview"
import DialogChooseIcon from "@/components/DialogChooseIcon"
import DialogChooseGroup from "@/components/DialogChooseGroup.vue"
import {getGroupEntries, moveItems, removeItems} from "../../utils/kdbx-utils"

export default {
  name: 'EntryList',
  components: {
    DialogChooseIcon,
    EntryContextMenu,
    DialogEntryPreview,
    DialogChooseGroup
  },
  props: {
    currentGroupUuid: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      entryList: [],
      entryTableColumns: Object.freeze([
        // {name: 'star', align: 'center', label: '★', field: 'iconImg'},
        {name: 'title', align: 'left', label: 'Title', field: 'title', sortable: true},
        {
          name: 'creationTime',
          align: 'center',
          label: 'Created',
          field: 'creationTime',
          sortable: true
        },
        {
          name: 'lastModTime',
          align: 'center',
          label: 'Modified',
          field: 'lastModTime',
          sortable: true
        },
      ]),
      selected: [],
      icons: Object.freeze(icons.items),
      isDialogChooseIconVisible: false,
      isDialogPreviewVisible: false,
      isDialogChooseGroupVisible: false,
      currentEntryWrap: {},
    }
  },
  computed: {
    database: {
      get: () => store.getters.database
    },
    pagination: {
      get: () => store.getters.currentEntryPagination,
      set: val => store.commit('setCurrentEntryPagination', val)
    }
  },
  watch: {
    currentGroupUuid: {
      handler() {
        this.handleRefreshEntryList()
      },
      immediate: true
    }
  },
  methods: {
    formatDateLite,
    getSelectedString() {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''}`
    },
    handleRowClick(row) {
      store.commit('setCurrentEntry', row._entry)
      this.$router.push({
        name: 'Detail'
      })
    },
    handleRowContextMenu(item) {
      const selected = this.selected

      if (selected.length === 1) {
        this.selected = [item]
        return
      }

      const index = selected.findIndex(i => {
        return i.id === item.id
      })
      if (index === -1) {
        selected.push(item)
      }

      // console.log(item)
    },
    updateEntryIcon(iconIndex) {
      this.currentEntryWrap.iconIndex = iconIndex
      this.currentEntryWrap._entry.icon = iconIndex
      store.commit('setIsNotSave')
    },
    handlePreview(target) {
      this.isDialogPreviewVisible = true
      this.currentEntryWrap = target
    },
    handleRename(items) {
      const [target] = items
      this.$q.dialog({
        title: 'Rename',
        prompt: {
          model: target.title,
          isValid: val => val !== target.title,
          type: 'text'
        },
        cancel: true,
        persistent: false
      }).onOk(data => {
        target.title = data
        target._entry.fields.Title = data
        store.commit('setIsNotSave')
      })
    },
    handleEdit(items) {
      const [target] = items
      this.handleRowClick(target)
    },
    handleChangeIcon(target) {
      this.isDialogChooseIconVisible = true
      this.currentEntryWrap = target
    },
    handleShowChooseEntry() {
      this.isDialogChooseGroupVisible = true
    },
    handleMoveEntry(groupUuid) {
      const entries = this.selected.map(item => item._entry)
      const result = moveItems(this.database, entries, groupUuid)
      if (result) {
        this.handleRefreshEntryList()
      }
    },
    handleDelete(items) {
      function getTitle(v) {
        return `<li><span class="text-red">${v.title}</span></li>`
      }

      let msgItems
      if (items.length > 1) {
        msgItems = items.map(i => getTitle(i)).join('')
      } else {
        msgItems = getTitle(items[0])
      }

      let msgAction
      if (store.getters.databaseRecycleBinEnabled) {
        msgAction = 'move to trash bin'
      } else {
        msgAction = '<b>DELETE</b>'
      }

      this.$q.dialog({
        title: 'Confirm',
        message: `Are you sure you want to ${msgAction}?<br><ul>${msgItems}</ul>`,
        html: true,
        cancel: true,
        persistent: false
      }).onOk(() => {
        const entries = items.map(item => item._entry)

        removeItems(this.database, entries)
        this.handleRefreshEntryList()
      })
    },
    handleRefreshEntryList() {
      if (!this.database) {
        this.entryList = []
        return
      }
      this.currentEntryWrap = {}
      this.selected = []
      this.entryList = getGroupEntries(this.database, this.currentGroupUuid)
      // console.log(this.entryList)
    }
  }
}
</script>

<style lang="stylus" scoped>
>>> .q-table--dense .q-table th, .q-table--dense .q-table td {
  padding: 10px 8px !important;
}
</style>
