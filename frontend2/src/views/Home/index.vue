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
              :selected-group-uuid.sync="currentGroupUuid"
              @onCreateEntry="handleAddEntryFromGroup"
            />
          </div>
          <div style="height: 80px"></div>
        </div>
      </template>

      <template v-slot:after>
        <EntryList
          v-if="isListView"
          :current-group-uuid="currentGroupUuid"
        />

        <CalendarView
          v-else
          :current-group-uuid="currentGroupUuid"
        />
      </template>

    </q-splitter>

    <q-page-sticky position="bottom-left" :offset="[18, 18]">
      <TkButton fab icon="add" color="secondary" :title="$t('home.add-entry')" @click="isDialogAddEntryVisible = true"/>
    </q-page-sticky>

    <DialogAddEntry
      ref="addEntry"
      :visible.sync="isDialogAddEntryVisible"
      @confirm="handleAddEntry"
    />
  </q-page>
</template>

<script>
import store from '@/store'
import {addEntry} from '@/utils/kdbx-utils'
import GroupTreeWrap from './GroupTreeWrap'
import EntryList from '@/views/Home/EntryList'
import CalendarView from '@/views/Home/CalendarView'
import DialogAddEntry from '@/components/DialogAddEntry'

export default {
  name: 'DbListView',
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
    },
    handleAddEntryFromGroup(group) {
      this.isDialogAddEntryVisible = true
      this.$nextTick(() => {
        this.$refs.addEntry.getGroupInfo(group)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  height: calc(100vh - 50px);
}

.nav-tree {
  min-width: 350px;
}
</style>
