<template>
  <TkModalDialog show-close v-model="mVisible">
    <TkCard class="text-center overflow-hidden">
      <slot></slot>
    </TkCard>
  </TkModalDialog>
</template>

<script>

export default {
  name: 'DialogPreview',
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

