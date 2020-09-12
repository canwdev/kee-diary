<template>
  <q-menu
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
          <q-icon :name="item.icon" size="sm" class="q-mr-sm"/>
          <q-item-label>{{ item.label }}</q-item-label>
        </q-item>
      </template>
      <q-separator/>
    </q-list>
  </q-menu>
</template>

<script>
export default {
  name: 'ContextMenu',
  props: {
    target: {
      type: Object,
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
          icon: 'visibility', label: 'Preview', action: () => {
            this.emitEvent('onPreview')
          }
        },
        {
          id: 'rename',
          icon: 'space_bar', label: 'Rename', action: () => {
            this.emitEvent('onRename')
          }
        },
        {
          id: 'edit',
          icon: 'edit', label: 'Edit', action: () => {
            this.emitEvent('onEdit')
          }
        },
        {
          id: 'changeIcon',
          icon: 'star', label: 'Change icon', action: () => {
            this.emitEvent('onChangeIcon')
          }
        },
        {isSeparator: true},
        {
          id: 'logToConsole',
          icon: 'code', label: 'Log to console', action: () => {
            console.log(this.target)
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
    menuListFiltered() {
      if (!this.hiddenItems || this.hiddenItems.length === 0) {
        return this.menuList
      }
      return this.menuList.filter(item => {
        return this.hiddenItems.indexOf(item.id) === -1
      })
    }
  },
  methods: {
    emitEvent(eventName) {
      this.$emit(eventName, this.target)
    }
  }
}
</script>
