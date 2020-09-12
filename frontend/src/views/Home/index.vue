<template>
  <q-page>
    <q-splitter
        v-model="splitterModel"
    >
      <template v-slot:before>
        <div class="q-pa-md">
          <GroupTree
              :selectedGroupUUID.sync="currentGroupUUID"
          />
        </div>

      </template>

      <template v-slot:after>
        <EntryList
            :database="database"
            :entry-list="entryList"
            @onRefresh="handleRefreshEntryList"
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
import {getGroupEntries, addEntry} from "@/utils/kdbx-utils"
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
      splitterModel: 30,
      entryList: []
    }
  },
  computed: {
    database: {
      get: () => store.getters.database
    },
    currentGroupUUID: {
      get: () => store.getters.currentGroupUUID,
      set: val => store.commit('setCurrentGroupUUID', val)
    }
  },
  watch: {
    currentGroupUUID: {
      handler() {
        this.handleRefreshEntryList()
      },
      immediate: true
    }
  },
  methods: {
    handleAddEntry() {
      const res = addEntry(this.database, this.currentGroupUUID)
      if (res) {
        this.$router.push({
          name: 'Detail'
        })
      }
    },
    handleRefreshEntryList() {
      if (!this.database) {
        this.entryList = []
        return
      }
      this.entryList = getGroupEntries(this.database, this.currentGroupUUID)
      // console.log(this.entryList)
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
