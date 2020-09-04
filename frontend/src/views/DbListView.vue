<template>
  <q-page
      class="col"
  >
    <div class="q-pa-md q-gutter-sm">
      <q-tree
          :nodes="groupTree"
          node-key="id"
          label-key="name"
      />
    </div>

    <div>
      <q-btn color="primary" @click="handleLog">log</q-btn>
    </div>
  </q-page>
</template>

<script>
import store from "@/store"
import {deepWalkGroup} from "../utils/kdbx-utils"

export default {
  name: "DbListView",
  data() {
    return {
      groupTree: []
    }
  },
  computed: {
    database: {
      get: () => store.getters.database
    }
  },
  watch: {
    database: {
      handler(db) {
        if (!db) {
          this.groupTree = []
          return
        }

        this.groupTree = deepWalkGroup(db.groups)
      },
      immediate: true
    }
  },
  methods: {
    handleLog() {


      console.log(this.database)
      this.groupTree = deepWalkGroup(this.database.groups)

      console.log(this.groupTree)
    }
  }
}
</script>

<style scoped>

</style>
