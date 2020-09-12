<template>
  <div class="group-tree-wrap">
    <q-tree
        :nodes="groupTree"
        node-key="id"
        label-key="name"
        selected-color="primary"
        :selected.sync="selectedGroupUuidStr"
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

        <template v-if="advanced">
          <ContextMenuCommon
              :target-data="prop.node"
              :hidden-items="['preview', 'rename', 'edit']"
              @onChangeIcon="handleShowChangeIcon(prop.node)"
              @onMove="handleShowMove(prop.node)"
              @onDelete="handleDelete(prop.node)"
          />
        </template>
      </template>
    </q-tree>

    <template v-if="advanced">
      <DialogChooseIcon
          :visible.sync="isDialogChooseIconVisible"
          :index="previewTarget.iconIndex"
          @onChoose="handleUpdateIcon"
      />
      <DialogChooseGroup
          :visible.sync="isDialogChooseGroupVisible"
          @onChoose="handleMoveEntry"
      />
    </template>

  </div>
</template>

<script>
import icons from "@/assets/db-icons"
import store from "@/store"
import {getGroupTree} from "@/utils/kdbx-utils"
import ContextMenuCommon from "@/components/ContextMenuCommon"
import DialogChooseIcon from "@/components/DialogChooseIcon"
import DialogChooseGroup from "@/components/DialogChooseGroup.vue"
import {moveItems, removeItems} from "../../utils/kdbx-utils"

export default {
  name: "GroupTree",
  components: {
    ContextMenuCommon,
    DialogChooseIcon,
    DialogChooseGroup
  },
  props: {
    selectedGroupUuid: {
      type: Object,
      default: null
    },
    advanced: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      icons: Object.freeze(icons.items),
      groupTree: [],
      selectedGroupUuidStr: null,
      previewTarget: false,
      isDialogChooseIconVisible: false,
      isDialogChooseGroupVisible: false,
    }
  },
  computed: {
    database: {
      get: () => store.getters.database
    },
    groupUuidMap() {
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

      return getMap(groupTree)
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
  watch: {
    database: {
      handler(db) {
        if (!db) {
          this.groupTree = []
          return
        }

        this.updateGroupTree()
      },
      immediate: true
    },
    selectedGroupUuidStr: {
      handler(nv) {
        if (!nv) {
          this.mSelectedGroupUuid = null
          return
        }
        this.mSelectedGroupUuid = this.groupUuidMap[this.selectedGroupUuidStr]
      },
      immediate: true
    },
  },
  methods: {
    updateGroupTree() {
      this.groupTree = getGroupTree(this.database.groups)

      // re-open last group
      if (this.mSelectedGroupUuid) {
        this.selectedGroupUuidStr = this.mSelectedGroupUuid.id
        return
      }
      if (this.groupTree[0]) {
        this.selectedGroupUuidStr = this.groupTree[0].id
      }
    },
    handleShowChangeIcon(target) {
      this.previewTarget = target
      this.isDialogChooseIconVisible = true
    },
    handleShowMove(target) {
      this.previewTarget = target
      this.isDialogChooseGroupVisible = true
    },
    handleUpdateIcon(iconIndex) {
      this.previewTarget.iconIndex = iconIndex
      this.previewTarget._group.icon = iconIndex
      store.commit('setIsNotSave')
    },
    handleMoveEntry(groupUuid) {
      const result = moveItems(this.database, [this.previewTarget._group], groupUuid)
      if (result) {
        this.updateGroupTree()
      }
    },
    handleDelete(item) {
      // TODO: refactor
      const msgTitle = `<li><span class="text-red">${item.name}</span></li>`

      let msgAction
      msgAction = store.getters.databaseRecycleBinEnabled ? 'move to trash bin' : '<b>DELETE</b>'

      this.$q.dialog({
        title: 'Confirm',
        message: `Are you sure you want to ${msgAction}?<br><ul>${msgTitle}</ul>`,
        html: true,
        cancel: true,
        persistent: false
      }).onOk(() => {
        removeItems(this.database, [item._group])
        this.updateGroupTree()
      })
    },
  }
}
</script>

<style lang="stylus" scoped>
.group-tree-wrap {
  .tree-icon {
    border-radius 0
    margin-right: 8px
  }

  >>> .q-tree__node--selected {
    background $primary
  }

  .text-primary {
    .tree-name {
      color #fff
      font-weight: bold;
    }
  }
}

</style>
