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
        @onDelete="handleDeleteGroup"
        @onRename="handleRename"
        @onChangeIcon="handleChangeIcon"
        @onMove="handleMove"
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
      @addGroupSuccess="refreshGroup"
    />

    <DialogEntryPreview
      :visible.sync="isShowPreview"
      :item="previewItem"
    />

    <DialogChooseIcon
      :visible.sync="isShowChooseIcon"
      :index="curIcon"
      @onChoose="updateIcon"
    />

    <DialogChooseGroup
      ref="groupChooser"
      :visible.sync="isShowChooseGroup"
      :tips="$t('kdbx.do-not-move-to-the-group-itself')"
      :auto-expand-uuid="autoExpandUuid"
      not-allow-select-sub
      @onChoose="changeGroup"
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
import {removeGroup, updateGroup, moveGroup} from '@/api'
import DialogChooseIcon from '@/components/DialogChooseIcon'
import DialogChooseGroup from '@/components/DialogChooseGroup'

export default {
  name: 'HomeView',
  components: {
    EntryList,
    GroupView,
    // CalendarView,
    DialogAdd,
    DialogEntryPreview,
    DialogChooseIcon,
    DialogChooseGroup,
  },
  data() {
    return {
      isShowDialogAdd: false,
      isShowPreview: false,
      isAddGroup: false,
      previewItem: null,
      isShowChooseIcon: false,
      isShowChooseGroup: false,
      curIcon: null,
      curItem: null
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
    },
    autoExpandUuid() {
      const item = this.curItem
      if (item) {
        return item.data.uuid
      }
      return null
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
    refreshGroup() {
      this.$refs.groupView.updateTree()
      this.$refs.groupChooser.updateTree()
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
    handleDeleteGroup(item) {
      this.$prompt.create({
        propsData: {
          title: this.$t('confirm'),
          content: this.$t('menu.are-you-sure'),
        },
        parentEl: this.$el
      }).onConfirm(async () => {
        await removeGroup({
          groupUuid: item.data.uuid
        })
        this.$store.commit('setIsChanged', true)
        this.refreshGroup()
      })
    },
    handlePreviewItem(item) {
      this.isShowPreview = true
      this.previewItem = item
    },
    handleRename(item) {
      this.$prompt.create({
        propsData: {
          title: this.$t('rename'),
          input: {
            value: item.title,
            required: true,
            placeholder: item.title,
          }
        },
        parentEl: this.$el
      }).onConfirm(async (context) => {
        if (context.inputValue === item.title) {
          return
        }
        await updateGroup({
          uuid: item.data.uuid,
          updates: [
            {path: 'name', value: context.inputValue},
          ]
        })
        item.title = context.inputValue
        this.$store.commit('setIsChanged', true)
      })
    },
    async updateIcon(icon) {
      const item = this.curItem

      await updateGroup({
        uuid: item.data.uuid,
        updates: [
          {path: 'icon', value: icon},
        ]
      })

      item.data.icon = icon
      this.$store.commit('setIsChanged', true)
      this.curIcon = null
      this.curItem = null
    },
    handleChangeIcon(item) {
      this.isShowChooseIcon = true
      this.curIcon = item.data.icon
      this.curItem = item
    },
    async changeGroup(group) {
      console.log(group)

      await moveGroup({
        uuid: this.curItem.data.uuid,
        targetUuid: group.data.uuid,
      })

      this.refreshGroup()
      this.$store.commit('setIsChanged', true)
      this.isShowChooseGroup = false
      this.curItem = null
    },
    handleMove(item) {
      this.isShowChooseGroup = true
      this.curItem = item
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  height: calc(100vh - 50px);
  display: flex;

  .nav-tree {
    transition: $common-transition;
    width: 350px;
  }

  .home-right {
    flex: 1;
    border-radius: 0;
    border: none;
    border-left: $layout-border;
    background: $color-white;
  }

  @media screen and (max-width: $mq_tablet_width) {
    .nav-tree {
      width: 240px;
    }
  }

  @media screen and (max-width: $mq_mobile_width) {
    flex-direction: column;
    .nav-tree {
      width: 100%;
      height: 150px;
    }
    .home-right {
      height: 100%;
      overflow: hidden;
      border-left: none;
      border-top: $layout-border;
    }
  }

  .sticky-area {
    position: fixed;
    bottom: 18px;
    left: 18px;
    z-index: 20;

    button {
      box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.3);
    }
  }
}

.tk-dark-theme {
  .home-page {
    .home-right {
      background: $dark-page;
    }
  }
}
</style>
