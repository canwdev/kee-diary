<template>
  <TkModalDialog v-model="mVisible">
    <TkCard class="q-pa-lg">

      <TkCard-section class="q-pa-lg text-center">
        <slot></slot>
      </TkCard-section>
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

