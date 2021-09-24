<template>
  <TkContextMenu class="common-menu" ref="ctxMenu">
    <template v-for="(item, index) in menuListFiltered">
      <hr
        v-if="item.isSeparator"
        :key="index"
      />
      <li
        v-else-if="!item.hidden"
        :key="index"
        class="menu-item"
        @click="item.action"
      >
        <i class="material-icons text-primary">{{ item.icon }}</i>
        {{ item.label }}
      </li>
    </template>
  </TkContextMenu>
</template>

<script>
// hidden when root group
function isHiddenGroupRoot(isGroup, targetData) {
  if (!isGroup) {
    return false
  }
  try {
    return !(targetData.parent)
  } catch {
    return false
  }
}

export default {
  name: 'ContextMenuCommon',
  props: {
    hiddenItems: {
      type: Array,
      default() {
        return []
      }
    },
    isGroup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      targetData: null,
    }
  },
  computed: {
    isTargetArray() {
      return Array.isArray(this.targetData)
    },
    menuList() {
      return [
        {
          id: 'createEntry',
          hidden: !this.isGroup,
          icon: 'add_circle', label: this.$t('menu.create-entry'), action: () => {
            this.emitEvent('onCreateEntry')
          }
        },
        {
          id: 'createGroup',
          hidden: !this.isGroup,
          icon: 'add_box', label: this.$t('menu.create-group'), action: () => {
            this.emitEvent('onCreateGroup')
          }
        },
        {
          id: 'preview',
          showOnlyOne: true,
          icon: 'visibility', label: this.$t('preview'), action: () => {
            this.emitEvent('onPreview')
          }
        },
        {
          id: 'rename',
          showOnlyOne: true,
          icon: 'space_bar', label: this.$t('rename'), action: () => {
            this.emitEvent('onRename')
          }
        },
        {
          id: 'edit',
          showOnlyOne: true,
          icon: 'edit', label: this.$t('edit'), action: () => {
            this.emitEvent('onEdit')
          }
        },
        {
          id: 'changeIcon',
          showOnlyOne: true,
          icon: 'star', label: this.$t('menu.change-icon'), action: () => {
            this.emitEvent('onChangeIcon')
          }
        },
        {
          id: 'changeColor',
          showOnlyOne: true,
          icon: 'palette', label: this.$t('menu.change-color'), action: () => {
            this.emitEvent('onChangeColor')
          }
        },
        {isSeparator: true},
        {
          id: 'logToConsole',
          icon: 'code', label: this.$t('menu.log-to-console'), action: () => {
            console.log(this.targetData)
          }
        },
        {
          id: 'move',
          hidden: isHiddenGroupRoot(this.isGroup, this.targetData),
          icon: 'double_arrow', label: this.$t('move') + '...', action: () => {
            this.emitEvent('onMove')
          }
        },
        {
          id: 'delete',
          hidden: isHiddenGroupRoot(this.isGroup, this.targetData),
          icon: 'delete', label: this.$t('delete'), action: () => {
            this.emitEvent('onDelete')
          }
        }
      ]
    },
    menuListFiltered() {
      if (!this.targetData || this.targetData.length === 0) {
        return []
      }

      return this.menuList.filter(item => {
        return (this.hiddenItems.indexOf(item.id) === -1) && this.isShowOnlyOne(item)
      })
    }
  },
  methods: {
    open(data) {
      this.targetData = data
      this.$refs.ctxMenu.open()
    },
    emitEvent(eventName) {
      this.$emit(eventName, this.targetData)
    },
    // show when only one targetData is selected
    isShowOnlyOne(item) {
      if (this.isTargetArray && this.targetData.length > 1 && item.showOnlyOne) {
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.common-menu {
  ::v-deep .menu-item {
    &:hover {
      i {
        color: white !important;
      }
    }
  }
}

</style>
