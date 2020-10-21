<template>
  <q-menu
      transition-show="none"
      transition-hide="none"
      touch-position
      context-menu
  >
    <q-list dense style="min-width: 100px">

      <template v-for="(item, index) in menuListFiltered">
        <q-separator
            v-if="item.isSeparator"
            :key="index"
        />
        <q-item
            v-else-if="!item.hidden"
            :key="index"
            @click="item.action"
            clickable v-close-popup
            class="row items-center"
        >
          <q-icon :name="item.icon" color="secondary" size="sm" class="q-mr-sm"/>
          <q-item-label>{{ item.label }}</q-item-label>
        </q-item>
      </template>
    </q-list>
  </q-menu>
</template>

<script>
// hidden when root group
function isHiddenGroupRoot(isGroup, targetData) {
  if (!isGroup) {
    return false
  }
  try {
    return !(targetData._origin.parentGroup)
  } catch {
    return false
  }
}

export default {
  name: 'ContextMenuCommon',
  props: {
    targetData: {
      type: [Object, Array],
      default: null
    },
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
      menuList: [
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
    }
  },
  computed: {
    isTargetArray() {
      return Array.isArray(this.targetData)
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
