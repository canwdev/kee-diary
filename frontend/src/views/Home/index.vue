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
        @onRename="i => handleRename(i, true)"
        @onChangeIcon="i => handleChangeIcon(i, true)"
        @onChangeColor="i => handleChangeColor(i, true)"
        @onDelete="i => handleDeleteEntry(i)"
        @onMove="i => handleMove(i, true)"
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

    <DialogChooseColor
      ref="colorChooser"
      :item="curItem"
      :visible.sync="isShowChooseColor"
      @onChoose="updateColor"
    />

    <DialogChooseGroup
      ref="groupChooser"
      :visible.sync="isShowChooseGroup"
      :tips="isCurrentItemEntry ? null : $t('kdbx.do-not-move-to-the-group-itself')"
      :auto-expand-uuid="autoExpandUuid"
      :not-allow-select-sub="!isCurrentItemEntry"
      @onChoose="changeGroup"
    />

  </div>
</template>

<script>
import GroupView from './GroupView.vue'
import EntryList from '@/components/EntryList/index.vue'
// import CalendarView from '@/views/Home/CalendarView.vue'
import DialogAdd from '@/components/DialogAdd.vue'
import DialogEntryPreview from '@/components/DialogEntryPreview.vue'
import mainBus, {BUS_SHOW_PREVIEW} from '@/utils/bus'
import {removeGroup, removeEntry, moveEntry, updateGroup, updateEntry, moveGroup, getRecycleText} from '@/api'
import DialogChooseIcon from '@/components/DialogChooseIcon.vue'
import DialogChooseGroup from '@/components/DialogChooseGroup.vue'
import DialogChooseColor from '@/components/DialogChooseColor.vue'

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
    DialogChooseColor,
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
      curItem: null,
      isShowChooseColor: false,
    }
  },
  computed: {
    database: {
      get() {
        return this.$store.getters.database
      }
    },
    selectedGroup: {
      get() {
        return this.$store.state.selectedGroup
      },
      set(val) {
        this.$store.commit('setSelectedGroup', val)
      }
    },
    isListView: {
      get() {
        return this.$store.getters.isListView
      },
    },
    autoExpandUuid() {
      const item = this.curItem
      if (item && item.data) {
        return item.data.uuid
      }
      return null
    },
    isCurrentItemEntry() {
      return this.curItem && !this.curItem.data
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
        this.refreshEntryList()
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
    refreshEntryList() {
      this.$refs.entryList.loadEntryList()
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
      const msgAction = getRecycleText(item.data.uuid)
      this.$prompt.create({
        propsData: {
          title: this.$t('confirm'),
          useHTML: true,
          content: `${this.$t('menu.are-you-sure')} <b>${msgAction}</b>?<br><p>${item.title}</p>`,
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
    handleDeleteEntry(item) {
      const msgAction = getRecycleText(item.uuid)
      this.$prompt.create({
        propsData: {
          title: this.$t('confirm'),
          useHTML: true,
          content: `${this.$t('menu.are-you-sure')} <b>${msgAction}</b>?<br><p>${item.title}</p>`,
        },
        parentEl: this.$el
      }).onConfirm(async () => {
        await removeEntry({
          uuid: item.uuid
        })
        this.$store.commit('setIsChanged', true)
        this.refreshEntryList()
      })
    },
    handlePreviewItem(item) {
      this.isShowPreview = true
      this.previewItem = item
    },
    handleRename(item, isEntry = false) {
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
        if (isEntry) {
          await updateEntry({
            uuid: item.uuid,
            updates: [
              {path: 'fields.Title', value: context.inputValue},
            ]
          })
        } else {
          await updateGroup({
            uuid: item.data.uuid,
            updates: [
              {path: 'name', value: context.inputValue},
            ]
          })
        }

        item.title = context.inputValue
        this.$store.commit('setIsChanged', true)
      })
    },
    async updateIcon(icon) {
      const item = this.curItem

      if (this.isCurrentItemEntry) {
        await updateEntry({
          uuid: item.uuid,
          updates: [
            {path: 'icon', value: icon},
          ]
        })
        item.icon = icon
      } else {
        await updateGroup({
          uuid: item.data.uuid,
          updates: [
            {path: 'icon', value: icon},
          ]
        })
        item.data.icon = icon
      }

      this.$store.commit('setIsChanged', true)
      this.curIcon = null
      this.curItem = null
    },
    handleChangeIcon(item, isEntry) {
      this.isShowChooseIcon = true
      this.curIcon = isEntry ? item.icon : item.data.icon
      this.curItem = item
    },
    handleChangeColor(item) {
      this.curItem = item
      this.isShowChooseColor = true
    },
    async updateColor(result) {
      console.log(result)
      const {type, value} = result

      const item = this.curItem

      await updateEntry({
        uuid: item.uuid,
        updates: [
          {path: type, value: value},
        ]
      })
      this.curItem[type] = value
      this.$store.commit('setIsChanged', true)
      this.curItem = null
    },
    async changeGroup(group) {
      console.log(group)
      const item = this.curItem

      if (this.isCurrentItemEntry) {
        await moveEntry({
          groupUuid: group.data.uuid,
          uuid: item.uuid
        })
        this.refreshEntryList()
      } else {
        await moveGroup({
          uuid: item.data.uuid,
          targetUuid: group.data.uuid,
        })
        this.refreshGroup()
      }
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
    background: rgba(255, 255, 255, .5);
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
      background: transparent;
    }
  }
}
</style>
