<template>
  <div
    class="home-page"
  >
    <div class="nav-tree">
      <GroupView
        ref="groupView"
        :selected.sync="selectedGroup"
        @onCreateEntry="handleAddEntry"
        @onCreateGroup="handleAddGroup"
      />

    </div>

    <div class="home-right">
      <EntryList
        v-if="isListView"
        ref="entryList"
        :selected-group="selectedGroup"
      />

      <!--      <CalendarView-->
      <!--          v-else-->
      <!--          :current-group-uuid="selectedGroup"-->
      <!--      />-->
    </div>

    <div class="sticky-area">
      <TkButton theme="accent" round :title="$t('home.create-entry')" @click="handleAddEntry()">
        <i class="material-icons">add</i>
      </TkButton>
    </div>

    <DialogAdd
      ref="dialogAdd"
      :visible.sync="isShowDialogAdd"
      :is-add-group="isAddGroup"
      @addEntrySuccess="addEntrySuccess"
      @addGroupSuccess="addGroupSuccess"
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
import DialogAdd from '@/components/DialogAdd'
import DialogEntryPreview from '@/components/DialogEntryPreview'
import mainBus, {BUS_SHOW_PREVIEW} from '@/utils/bus'

export default {
  name: 'HomeView',
  components: {
    EntryList,
    GroupView,
    // CalendarView,
    DialogAdd,
    DialogEntryPreview
  },
  data() {
    return {
      isShowDialogAdd: false,
      isShowPreview: false,
      isAddGroup: false,
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
    this.$refs.groupView.updateTree()
    mainBus.$on(BUS_SHOW_PREVIEW, this.handlePreviewItem)
  },
  beforeDestroy() {
    mainBus.$off(BUS_SHOW_PREVIEW, this.handlePreviewItem)
  },
  activated() {
  },
  methods: {
    addEntrySuccess({entry, group}) {
      this.$store.commit('setSelectedGroup', group)
      this.$nextTick(() => {
        this.$refs.entryList.loadEntryList()
      })
      this.$router.push({
        name: 'Detail',
        params: {
          uuid: entry.uuid
        }
      })
    },
    addGroupSuccess() {
      this.$refs.groupView.updateTree()
    },
    handleAddEntry(group) {
      this.isAddGroup = false
      this.isShowDialogAdd = true
      if (group) {
        this.$nextTick(() => {
          this.$refs.dialogAdd.setGroupInfo(group)
        })
      }
    },
    handleAddGroup(group) {
      this.isAddGroup = true
      this.isShowDialogAdd = true
      this.$nextTick(() => {
        this.$refs.dialogAdd.setGroupInfo(group)
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
