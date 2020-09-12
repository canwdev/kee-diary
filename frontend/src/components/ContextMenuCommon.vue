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
      <q-separator/>
    </q-list>
  </q-menu>
</template>

<script>
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
    }
  },
  data() {
    return {
      menuList: [
        {
          id: 'preview',
          showOnlyOne: true,
          icon: 'visibility', label: 'Preview', action: () => {
            this.emitEvent('onPreview')
          }
        },
        {
          id: 'rename',
          showOnlyOne: true,
          icon: 'space_bar', label: 'Rename', action: () => {
            this.emitEvent('onRename')
          }
        },
        {
          id: 'edit',
          showOnlyOne: true,
          icon: 'edit', label: 'Edit', action: () => {
            this.emitEvent('onEdit')
          }
        },
        {
          id: 'changeIcon',
          showOnlyOne: true,
          icon: 'star', label: 'Change icon', action: () => {
            this.emitEvent('onChangeIcon')
          }
        },
        {isSeparator: true},
        {
          id: 'logToConsole',
          icon: 'code', label: 'Log to console', action: () => {
            console.log(this.targetData)
          }
        },
        {
          id: 'move',
          icon: 'double_arrow', label: 'Move...', action: () => {
            this.emitEvent('onMove')
          }
        },
        {
          id: 'delete',
          icon: 'delete', label: 'Delete', action: () => {
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
        return (this.hiddenItems.indexOf(item.id) === -1) && this.testShowOnlyOne(item)
      })
    }
  },
  methods: {
    emitEvent(eventName) {
      this.$emit(eventName, this.targetData)
    },
    // show when only one targetData is selected
    testShowOnlyOne(item) {
      if (this.isTargetArray && this.targetData.length > 1 && item.showOnlyOne) {
        return false
      }
      return true
    }
  }
}
</script>
