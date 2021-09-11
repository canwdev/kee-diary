<template>
  <div>
    <div
        class="home-page"
    >
      <div class="nav-tree">
        <div class="">
          <GroupTreeWrap
              :selected-group-uuid.sync="currentGroupUuid"
              @onCreateEntry="handleAddEntryFromGroup"
          />
        </div>
        <div style="height: 80px"></div>
      </div>

      <div v-if="false" class="home-right">
        <EntryList
            v-if="isListView"
            :current-group-uuid="currentGroupUuid"
        />

        <CalendarView
            v-else
            :current-group-uuid="currentGroupUuid"
        />
      </div>

    </div>

    <div class="sticky-area">
      <TkButton fab icon="add" color="secondary" :label="$t('home.add-entry')" @click="isDialogAddEntryVisible = true"/>
    </div>

    <DialogAddEntry
        ref="addEntry"
        :visible.sync="isDialogAddEntryVisible"
        @confirm="handleAddEntry"
    />
  </div>
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
  display: flex;

  .home-right {
    flex: 1;
  }
}

.nav-tree {
  min-width: 350px;
}

.sticky-area {
  position: fixed;
  bottom: 18px;
  left: 18px;
  z-index: 20;
}
</style>
