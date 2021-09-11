<template>
  <div class="">

    <div class="entry-table">
      <div class="table-head">
        <div class="t-col">★</div>
        <div class="t-col">{{ $t('home.title') }}</div>
        <div class="t-col">{{ $t('home.created') }}</div>
        <div class="t-col">{{ $t('home.modified') }}</div>
      </div>

      <div class="table-body">
        <div
            v-for="item in entryList"
            :key="item.id"
            class="relative-position table-row _check"
        >


          <div class="t-col">
            <IconShow
                class="cursor-pointer"
                :item="item"
                @click.native.stop="handlePreview(item)"
            />
          </div>
          <div class="t-col">{{ item.title }}</div>
          <div class="t-col">{{ formatDateLite(item.creationTime) }}</div>
          <div class="t-col">{{ formatDateLite(item.lastModTime) }}</div>
        </div>


      </div>


    </div>

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
import {formatDateLite} from '@/utils'
import store from '@/store'
import ContextMenuCommon from '@/components/ContextMenuCommon'
import DialogPreviewEntry from '@/components/DialogPreviewEntry'
import DialogChooseIcon from '@/components/DialogChooseIcon'
import DialogChooseColor from '@/components/DialogChooseColor'
import DialogChooseGroup from '@/components/DialogChooseGroup'
import IconShow from '@/components/IconShow'
import {getGroupEntries, moveItems} from '@/utils/kdbx-utils'
import {handleCommonDelete, handleCommonRename} from './common-action'

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

<style lang="scss" scoped>
.entry-table {
  width: 100%;
  flex: 1;
  opacity: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .table-head {
    height: 50px;
    opacity: 1;
    border-radius: 4px 4px 0px 0px;
    flex-wrap: nowrap;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .table-body {
    flex: 1;
    overflow: auto;
    overflow-y: overlay; // 滚动条覆盖

    ::v-deep .table-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      border-bottom: 1px solid gray;
    }
  }

  ::v-deep .t-col {
    //&._check {
    //  width: 107px;
    //  text-align: center;
    //}

  }
}

</style>
