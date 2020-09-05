<template>
  <q-page>
    <div class="q-pa-lg">
      <q-card v-if="isEntryOpen">
        <q-card-section>
          <q-editor
              v-model="currentEntry.fields.Notes"
              min-height="30rem"
              :toolbar="toolbar"
          />
        </q-card-section>
      </q-card>
    </div>

  </q-page>
</template>

<script>
import store from '@/store'

export default {
  name: "Detail",
  data() {
    return {
      editor: 'What you see is <b>what</b> you get.',
      toolbar: [
        ['viewsource'],
        ['undo', 'redo'],
        [
          {
            label: this.$q.lang.editor.align,
            icon: this.$q.iconSet.editor.align,
            fixedLabel: true,
            options: ['left', 'center', 'right', 'justify']
          },
          {
            label: this.$q.lang.editor.formatting,
            icon: this.$q.iconSet.editor.formatting,
            list: 'no-icons',
            options: [
              'p',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'code'
            ]
          },
          {
            label: this.$q.lang.editor.fontSize,
            icon: this.$q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7'
            ]
          },
        ],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['hr', 'link'],
        ['fullscreen'],
      ]
    }
  },
  computed: {
    isEntryOpen: () => store.getters.isEntryOpen,
    currentEntry: {
      get: () => store.getters.currentEntry,
      // set: val => store.commit('setCurrentEntry', val)
    },
  },
  watch: {
    currentEntry: {
      handler(nv) {
        console.log(nv)
      },
      immediate: true,
    }
  }

}
</script>

<style scoped>

</style>
