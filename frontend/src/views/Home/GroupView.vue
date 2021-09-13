<template>
  <div class="group-tree-wrap">
    <GroupTree
      ref="groupTree"
      :selected.sync="mSelected"
    >
    </GroupTree>

  </div>
</template>

<script>
import GroupTree from '@/components/GroupTree'

export default {
  name: 'GroupView',
  components: {
    GroupTree,
  },
  props: {
    selected: {
      type: Object,
      default: null
    }
  },
  data() {
    return {}
  },
  computed: {
    mSelected: {
      get() {
        return this.selected
      },
      set(val) {
        this.$emit('update:selected', val)
      }
    }
  },
  methods: {}
}
</script>

