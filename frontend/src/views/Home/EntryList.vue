<template>
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
            @onChangeIcon="handleChangeIcon"
        />
      </template>

    </q-table>

    <DialogChooseIcon
        :visible.sync="isDialogChooseIconVisible"
        :index="currentEntry.iconIndex"
        @onChoose="updateEntryIcon"
    />

    <DialogEntryPreview
      :visible.sync="isDialogPreviewVisible"
      :entry="currentEntry._entry"
    />
  </div>
</template>

<script>
import {formatDateLite} from "@/utils"
import icons from "@/assets/db-icons"
import store from "@/store"
import DialogChooseIcon from "@/components/DialogChooseIcon"
import EntryContextMenu from "@/components/EntryContextMenu"
import DialogEntryPreview from "@/components/DialogEntryPreview"

export default {
  name: 'EntryList',
  components: {
    DialogChooseIcon,
    EntryContextMenu,
    DialogEntryPreview
  },
  props: {
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
      pagination: {
        rowsPerPage: 10
      },
      selected: [],
      icons: Object.freeze(icons.items),
      isDialogChooseIconVisible: false,
      isDialogPreviewVisible: false,
      currentEntry: {}
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
      this.currentEntry.iconIndex = iconIndex
      this.currentEntry._entry.icon = iconIndex
      store.commit('setIsNotSave')
    },
    handlePreview(target) {
      console.log('handlePreview', target)
      this.isDialogPreviewVisible = true
      this.currentEntry = target
    },
    handleEdit(target) {
      this.handleRowClick(null, target)
    },
    handleChangeIcon(target) {
      this.isDialogChooseIconVisible = true
      this.currentEntry = target
    },
  }
}
</script>
