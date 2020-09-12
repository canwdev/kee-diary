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
        @row-click="handleRowClick"
    >
      <template v-slot:body-cell-title="props">
        <q-td
            :props="props"
        >
          <q-avatar
              @click.stop="handlePreview(props.row)"
              size="32px" square>
            <img :src="icons[props.row.iconIndex]">
          </q-avatar>
          <span class="q-ml-md">{{ props.row.title }}</span>
        </q-td>
        <EntryContextMenu
            :target="props.row"
            @onPreview="handlePreview"
            @onEdit="handleEdit"
            @onRename="handleRename"
            @onChangeIcon="handleChangeIcon"
            @onMove="handleMove"
            @onDelete="handleDelete"
        />
      </template>

    </q-table>

    <DialogEntryPreview
      :visible.sync="isDialogPreviewVisible"
      :entry="currentEntryWrap._entry"
    />

    <DialogChooseIcon
        :visible.sync="isDialogChooseIconVisible"
        :index="currentEntryWrap.iconIndex"
        @onChoose="updateEntryIcon"
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
import {removeEntry} from "../../utils/kdbx-utils"

export default {
  name: 'EntryList',
  components: {
    DialogChooseIcon,
    EntryContextMenu,
    DialogEntryPreview
  },
  props: {
    database: {
      type: Object,
      default: null,
    },
    entryList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
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
      selected: [],
      icons: Object.freeze(icons.items),
      isDialogChooseIconVisible: false,
      isDialogPreviewVisible: false,
      currentEntryWrap: {}
    }
  },
  computed: {
    pagination: {
      get: () => store.getters.currentEntryPagination,
      set: val => store.commit('setCurrentEntryPagination', val)
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
    updateEntryIcon(iconIndex) {
      this.currentEntryWrap.iconIndex = iconIndex
      this.currentEntryWrap._entry.icon = iconIndex
      store.commit('setIsNotSave')
    },
    handlePreview(target) {
      this.isDialogPreviewVisible = true
      this.currentEntryWrap = target
    },
    handleRename(target) {
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
    handleEdit(target) {
      this.handleRowClick(null, target)
    },
    handleChangeIcon(target) {
      this.isDialogChooseIconVisible = true
      this.currentEntryWrap = target
    },
    handleMove(target) {
      console.log(target)
    },
    handleDelete(target) {
      this.$q.dialog({
        title: 'Confirm',
        message: `Are you sure you want to move <span class="text-red">${target.title}</span> to the trash bin?`,
        html: true,
        cancel: true,
        persistent: false
      }).onOk(() => {
        removeEntry(this.database, target._entry)
        this.$emit('onRefresh')
      })
    },
  }
}
</script>

<style lang="stylus" scoped>
>>> .q-table--dense .q-table th, .q-table--dense .q-table td {
  padding: 10px 8px !important;
}
</style>
