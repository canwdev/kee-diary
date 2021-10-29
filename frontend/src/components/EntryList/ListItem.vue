<template>
  <div
    class="relative-position table-row"
    @click="$emit('itemClick', item)"
    @contextmenu="$emit('itemContextMenu', item)"
  >
    <div class="t-col _icon">
      <ItemIcon
        class="cursor-pointer"
        :item="item"
        @click.native.stop="$emit('preview', item)"
      />
    </div>
    <div class="t-col _title">{{ item.title }}</div>
    <div class="t-col _time">{{ formatDate(item.creationTime) }}</div>
    <div class="t-col _time">{{ formatDate(item.lastModTime) }}</div>
  </div>
</template>

<script>
import ItemIcon from '@/components/ItemIcon.vue'
import {formatDate} from '@/utils'

export default {
  name: 'ListItem',
  components: {
    ItemIcon,
  },
  props: {
    item: {
      type: Object,
      default: null,
      required: true
    }
  },
  methods: {
    formatDate,
  }
}
</script>

