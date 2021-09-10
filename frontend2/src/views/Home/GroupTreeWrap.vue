<template>
  <div class="group-tree-wrap">
    <GroupTree
      ref="groupTree"
      :selected-group-uuid.sync="mSelectedGroupUuid"
    >
      <template v-slot:default="prop">
        <ContextMenuCommon
          :is-group="true"
          :target-data="prop.node"
          :hidden-items="['preview', 'edit', 'changeColor']"
          @onCreateEntry="handleCreateEntry"
          @onCreateGroup="handleCreateGroup"
          @onRename="handleRename"
          @onChangeIcon="handleShowChangeIcon"
          @onMove="handleShowMove"
          @onDelete="handleDelete"
        />
      </template>
    </GroupTree>

    <DialogChooseIcon
      :visible.sync="isDialogChooseIconVisible"
      :index="previewTarget.iconIndex"
      @onChoose="handleUpdateIcon"
    />
    <DialogChooseGroup
      :visible.sync="isDialogChooseGroupVisible"
      :show-tips="true"
      @onChoose="handleMoveEntry"
    />

  </div>
</template>

<script>
import store from '@/store'
import GroupTree from './GroupTree'
import ContextMenuCommon from '@/components/ContextMenuCommon'
import DialogChooseIcon from '@/components/DialogChooseIcon'
import DialogChooseGroup from '@/components/DialogChooseGroup'
import {addGroup, moveItems} from '@/utils/kdbx-utils'
import {handleCommonDelete, handleCommonRename} from './common-action'

export default {
  name: 'GroupTreeView',
  components: {
    GroupTree,
    ContextMenuCommon,
    DialogChooseIcon,
    DialogChooseGroup
  },
  props: {
    selectedGroupUuid: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      previewTarget: false,
      isDialogChooseIconVisible: false,
      isDialogChooseGroupVisible: false,
    }
  },
  computed: {
    database: {
      get: () => store.getters.database
    },
    mSelectedGroupUuid: {
      get() {
        return this.selectedGroupUuid
      },
      set(nv) {
        this.$emit('update:selectedGroupUuid', nv)
      }
    }
  },
  methods: {
    refreshGroupTree() {
      this.$refs.groupTree.refreshGroupTree()
    },
    handleCreateEntry(target) {
      this.$emit('onCreateEntry', target)
    },
    handleCreateGroup(target) {
      const result = addGroup(this.database, target.uuid)
      if (result) {
        this.refreshGroupTree()
      }
    },
    handleShowChangeIcon(target) {
      this.previewTarget = target
      this.isDialogChooseIconVisible = true
    },
    handleRename(target) {
      handleCommonRename(this, target, true)
    },
    handleUpdateIcon(iconIndex) {
      this.previewTarget.iconIndex = iconIndex
      this.previewTarget._origin.icon = iconIndex
      store.commit('setIsNotSave')
    },
    handleShowMove(target) {
      this.previewTarget = target
      this.isDialogChooseGroupVisible = true
    },
    handleMoveEntry(groupUuid) {
      const result = moveItems(this.database, [this.previewTarget._origin], groupUuid)
      if (result) {
        this.refreshGroupTree()
      }
    },
    handleDelete(target) {
      handleCommonDelete(this, target._origin, true).then(() => {
        this.refreshGroupTree()
      })
    }
  }
}
</script>

