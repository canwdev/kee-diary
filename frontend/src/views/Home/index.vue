<template>
  <q-page>
    <q-splitter
        v-model="splitterModel"
    >
      <template v-slot:before>
        <div class="q-pa-md">
          <GroupTree
              :selectedGroupUuid.sync="currentGroupUuid"
          />
        </div>

      </template>

      <template v-slot:after>
        <EntryList
            :currentGroupUuid="currentGroupUuid"
        />

        <div style="height: 80px"></div>
      </template>

    </q-splitter>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="secondary" @click="handleAddEntry" title="Add entry"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import store from "@/store"
import {addEntry} from "@/utils/kdbx-utils"
import GroupTree from "./GroupTree"
import EntryList from "@/views/Home/EntryList"

export default {
  name: "DbListView",
  components: {
    EntryList,
    GroupTree
  },
  data() {
    return {
      splitterModel: 30
    }
  },
  computed: {
    database: {
      get: () => store.getters.database
    },
    currentGroupUuid: {
      get: () => store.getters.currentGroupUuid,
      set: val => store.commit('setCurrentGroupUuid', val)
    }
  },
  methods: {
    handleAddEntry() {
      const res = addEntry(this.database, this.currentGroupUuid)
      if (res) {
        this.$router.push({
          name: 'Detail'
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
