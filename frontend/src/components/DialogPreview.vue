<template>
  <TkModalDialog v-model="mVisible" show-close>
    <TkCard class="text-center overflow-hidden">
      <slot></slot>
    </TkCard>
  </TkModalDialog>
</template>

<script>
import visibleMixin from '@/mixins/visible'

export default {
  name: 'DialogPreview',
  mixins: [visibleMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    mVisible: {
      get() {
        return this.visible
      },
      set(nv) {
        this.$emit('update:visible', nv)
      }
    }
  }
}
</script>

