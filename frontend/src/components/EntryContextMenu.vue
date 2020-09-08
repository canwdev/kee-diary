<template>
  <q-menu
      touch-position
      context-menu
  >
    <q-list dense style="min-width: 100px">

      <template v-for="(item, index) in menuList">
        <q-separator
            v-if="item.isSeparator"
            :key="index"
        />
        <q-item
            v-else
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
    }
  },
  data() {
    return {
      menuList: [
        {
          icon: 'visibility', label: 'Preview', action: () => {
            this.emitEvent('onPreview')
          }
        },
        {
          icon: 'edit', label: 'Edit', action: () => {
            this.emitEvent('onEdit')
          }
        },
        {
          icon: 'star', label: 'Change icon', action: () => {
            this.emitEvent('onChangeIcon')
          }
        },
        {isSeparator: true},
        {
          icon: 'double_arrow', label: 'Move...', action: () => {
            this.emitEvent('onMove')
          }
        },
        {
          icon: 'delete', label: 'Delete', action: () => {
            this.emitEvent('onDelete')
          }
        }
      ]
    }
  },
  methods: {
    emitEvent(eventName) {
      this.$emit(eventName, this.target)
    }
  }
}
</script>
