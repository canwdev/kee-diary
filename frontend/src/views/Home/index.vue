<template>
  <q-page>
    <q-splitter
        v-model="splitterModel"
    >
      <template v-slot:before>
        <div class="q-pa-md">
          <GroupTreeWrap
              :selectedGroupUuid.sync="currentGroupUuid"
          />
        </div>
        <div style="height: 80px"></div>
      </template>

      <template v-slot:after>
        <EntryList
            v-if="isListView"
            :currentGroupUuid="currentGroupUuid"
        />

        <CalendarView
            v-else
            :currentGroupUuid="currentGroupUuid"
        />
      </template>

    </q-splitter>

    <q-page-sticky position="bottom-left" :offset="[18, 18]">
      <q-btn fab icon="add" color="secondary" @click="handleAddEntry" :title="$t('home.add-entry')"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import store from "@/store"
import {addEntry} from "@/utils/kdbx-utils"
import GroupTreeWrap from "./GroupTreeWrap"
import EntryList from "@/views/Home/EntryList"
import CalendarView from "@/views/Home/CalendarView"

export default {
  name: "DbListView",
  components: {
    EntryList,
    GroupTreeWrap,
    CalendarView
  },
  data() {
    return {
      splitterModel: 30,
      isList: false
    }
  },
  computed: {
    database: {
      get: () => store.getters.database
    },
    currentGroupUuid: {
      get: () => store.getters.currentGroupUuid,
      set: val => store.commit('setCurrentGroupUuid', val)
    },
    isListView: {
      get: () => store.getters.isListView,
    }
  },
  methods: {
    handleAddEntry() {
      const result = addEntry(this.database, this.currentGroupUuid)
      if (result) {
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
