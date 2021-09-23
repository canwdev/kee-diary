<template>
  <div
    class="home-page"
  >
    <div class="nav-tree">
      <div>
        <GroupView
          ref="groupRef"
          :selected.sync="selectedGroup"
          @onCreateEntry="handleAddEntryFromGroup"
        />
      </div>
      <div style="height: 80px"></div>
    </div>

    <div class="home-right">
      <EntryList
        v-if="isListView"
        :selected-group="selectedGroup"
      />

      <!--      <CalendarView-->
      <!--          v-else-->
      <!--          :current-group-uuid="selectedGroup"-->
      <!--      />-->
    </div>

    <div class="sticky-area">
      <TkButton fab icon="add" color="secondary" :label="$t('home.add-entry')" @click="isShowAddEntry = true"/>
    </div>

    <DialogAddEntry
      ref="addEntry"
      :visible.sync="isShowAddEntry"
      @addSuccess="handleAddSuccess"
    />

    <DialogEntryPreview
      :visible.sync="isShowPreview"
      :item="previewItem"
    />

  </div>
</template>

<script>
import store from '@/store'
import GroupView from './GroupView'
import EntryList from '@/components/EntryList'
// import CalendarView from '@/views/Home/CalendarView'
import DialogAddEntry from '@/components/DialogAddEntry'
import DialogEntryPreview from '@/components/DialogEntryPreview'
import mainBus, {BUS_SHOW_PREVIEW} from '@/utils/bus'

export default {
  name: 'HomeView',
  components: {
    EntryList,
    GroupView,
    // CalendarView,
    DialogAddEntry,
    DialogEntryPreview
  },
  data() {
    return {
      isShowAddEntry: false,
      isShowPreview: false,
      previewItem: null
    }
  },
  computed: {
    database: {
      get: () => store.getters.database
    },
    selectedGroup: {
      get: () => store.state.selectedGroup,
      set: val => store.commit('setSelectedGroup', val)
    },
    isListView: {
      get: () => store.getters.isListView,
    }
  },
  mounted() {
    mainBus.$on(BUS_SHOW_PREVIEW, this.handlePreviewItem)
  },
  beforeDestroy() {
    mainBus.$off(BUS_SHOW_PREVIEW, this.handlePreviewItem)
  },
  activated() {
    this.$refs.groupRef.updateTree()
  },
  methods: {
    handleAddSuccess({entry, group}) {
      this.$store.commit('setSelectedGroup', group)
      this.$router.push({
        name: 'Detail',
        params: {
          uuid: entry.uuid
        }
      })
    },
    handleAddEntryFromGroup(group) {
      this.isShowAddEntry = true
      this.$nextTick(() => {
        this.$refs.addEntry.getGroupInfo(group)
      })
    },
    handlePreviewItem(item) {
      this.isShowPreview = true
      this.previewItem = item
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
    border-left: $layout-border;
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
