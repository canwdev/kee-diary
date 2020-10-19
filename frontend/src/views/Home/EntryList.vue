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
          <q-td @click.stop="" key="icon" class="text-center" style="width: 40px">
            <IconShow
                class="cursor-pointer"
                :item="props.row"
                @click.native.stop="handlePreview(props.row)"
            />
          </q-td>
          <q-td class="cursor-pointer" key="title" :props="props">
            {{ props.row.title }}
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

    <ContextMenuCommon
        :target-data="selected"
        @onPreview="handlePreview"
        @onEdit="handleEdit"
        @onRename="handleRename"
        @onChangeIcon="handleShowChangeIcon"
        @onChangeColor="handleShowChangeColor"
        @onMove="isDialogChooseGroupVisible = true"
        @onDelete="handleDelete"
    />

    <DialogPreviewEntry
        :visible.sync="isDialogPreviewVisible"
        :entry="previewTarget._origin"
    />

    <DialogChooseIcon
        :visible.sync="isDialogChooseIconVisible"
        :index="previewTarget.iconIndex"
        @onChoose="handleUpdateIcon"
    />
    <DialogChooseColor
        :item="previewTarget"
        :visible.sync="isDialogChooseColorVisible"
        @onChoose="handleUpdateColor"
    />

    <DialogChooseGroup
        :visible.sync="isDialogChooseGroupVisible"
        @onChoose="handleMoveEntry"
    />
  </div>
</template>

<script>
import {formatDateLite} from "@/utils"
import store from "@/store"
import ContextMenuCommon from "@/components/ContextMenuCommon"
import DialogPreviewEntry from "@/components/DialogPreviewEntry"
import DialogChooseIcon from "@/components/DialogChooseIcon"
import DialogChooseColor from "@/components/DialogChooseColor"
import DialogChooseGroup from "@/components/DialogChooseGroup"
import IconShow from "@/components/IconShow"
import {getGroupEntries, moveItems} from "@/utils/kdbx-utils"
import {handleCommonDelete, handleCommonRename} from "./common-action"

export default {
  name: 'EntryList',
  components: {
    DialogChooseIcon,
    DialogChooseColor,
    ContextMenuCommon,
    DialogPreviewEntry,
    DialogChooseGroup,
    IconShow
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
        {name: 'icon', align: 'center', label: '★', field: 'iconImg'},
        {name: 'title', align: 'left', label: this.$t('home.title'), field: 'title', sortable: true},
        {
          name: 'creationTime',
          align: 'center',
          label: this.$t('home.created'),
          field: 'creationTime',
          sortable: true
        },
        {
          name: 'lastModTime',
          align: 'center',
          label: this.$t('home.modified'),
          field: 'lastModTime',
          sortable: true
        },
      ]),
      selected: [],
      isDialogChooseIconVisible: false,
      isDialogChooseColorVisible: false,
      isDialogPreviewVisible: false,
      isDialogChooseGroupVisible: false,
      previewTarget: {},
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
        this.refreshEntryList()
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
      store.commit('setCurrentEntry', row._origin)
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
    selectPreviewTarget(target) {
      if (Array.isArray(target)) {
        this.previewTarget = target[0]
        return
      }
      this.previewTarget = target
    },
    handlePreview(target) {
      this.selectPreviewTarget(target)
      this.isDialogPreviewVisible = true
    },
    handleRename(items) {
      const [target] = items
      handleCommonRename(this, target)
    },
    handleEdit(items) {
      const [target] = items
      this.handleRowClick(target)
    },
    handleShowChangeIcon(target) {
      this.selectPreviewTarget(target)
      this.isDialogChooseIconVisible = true
    },
    handleUpdateIcon(iconIndex) {
      this.previewTarget.iconIndex = iconIndex
      this.previewTarget._origin.icon = iconIndex
      store.commit('setIsNotSave')
    },
    handleShowChangeColor(target) {
      this.selectPreviewTarget(target)
      this.isDialogChooseColorVisible = true
    },
    handleUpdateColor(result) {
      const {type, value} = result
      this.previewTarget[type] = value
      this.previewTarget._origin[type] = value
      store.commit('setIsNotSave')
    },
    handleMoveEntry(groupUuid) {
      const entries = this.selected.map(item => item._origin)
      const result = moveItems(this.database, entries, groupUuid)
      if (result) {
        this.refreshEntryList()
      }
    },
    handleDelete(items) {
      const entries = items.map(item => item._origin)

      handleCommonDelete(this, entries).then(() => {
        this.refreshEntryList()
      })
    },
    refreshEntryList() {
      if (!this.database) {
        this.entryList = []
        return
      }
      this.previewTarget = {}
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
