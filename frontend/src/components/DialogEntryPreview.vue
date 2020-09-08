<template>
  <q-dialog v-model="mVisible">
    <q-card v-if="entry" style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6 row items-center">
          <q-avatar size="32px" square>
            <img :src="icons[entry.icon]"/>
          </q-avatar>
          <span class="q-ml-md">{{entry.fields.Title}}</span>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-section style="max-height: 80vh" class="scroll q-pa-md">
        {{entry.fields.Notes}}
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import icons from '@/assets/db-icons'

export default {
  name: "DialogEntryPreview",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    entry: {
      type: Object,
      default: null
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
  },
  data() {
    return {
      icons: Object.freeze(icons.items),
    }
  }
}
</script>

<style scoped>

</style>
