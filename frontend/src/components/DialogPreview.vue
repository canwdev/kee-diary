<template>
  <q-dialog v-model="mVisible" transition-show="scale" transition-hide="scale">
    <q-card class="q-pa-lg">

      <q-card-section class="q-pa-lg text-center">
        <slot></slot>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: "DialogPreview",
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

<style lang="stylus" scoped>

</style>
