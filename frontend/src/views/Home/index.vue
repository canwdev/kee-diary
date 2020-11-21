<template>
  <q-page>
    <q-splitter
        v-model="splitterSize"
        class="home-page"
    >
      <template v-slot:before>
        <div class="nav-tree">
          <div class="q-pa-md">
            <GroupTreeWrap
                :selectedGroupUuid.sync="currentGroupUuid"
            />
          </div>
          <div style="height: 80px"></div>
        </div>
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
      <q-btn fab icon="add" color="secondary" @click="isDialogAddEntryVisible = true" :title="$t('home.add-entry')"/>
    </q-page-sticky>

    <DialogAddEntry
      :visible.sync="isDialogAddEntryVisible"
      @confirm="handleAddEntry"
    />
  </q-page>
</template>

<script>
import store from "@/store"
import {addEntry} from "@/utils/kdbx-utils"
import GroupTreeWrap from "./GroupTreeWrap"
import EntryList from "@/views/Home/EntryList"
import CalendarView from "@/views/Home/CalendarView"
import DialogAddEntry from "@/components/DialogAddEntry"

export default {
  name: "DbListView",
  components: {
    EntryList,
    GroupTreeWrap,
    CalendarView,
    DialogAddEntry
  },
  data() {
    return {
      isList: false,
      isDialogAddEntryVisible: false
    }
  },
  computed: {
    database: {
      get: () => store.getters.database
    },
    splitterSize: {
      get: () => store.getters.splitterSize,
      set: val => store.commit('setSplitterSize', val)
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
    handleAddEntry(data) {
      console.log(data)
      const result = addEntry(this.database, data.groupUuid || this.currentGroupUuid, {
        title: data.title,
        icon: data.iconIndex,
        bgColor: data.bgColor,
        fgColor: data.fgColor
      })
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
.home-page {
  height calc(100vh - 50px)
}
.nav-tree {
  min-width 350px
}
</style>
