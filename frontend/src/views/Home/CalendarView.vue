<template>
  <div class="calendar-view q-px-md q-py-lg">
    <Calendar
        ref="calendar"
        is-expanded
        :locale="locate"
        :is-dark="isDarkMode"
        :attributes="calendarAttributes"
        disable-page-swipe
        @update:from-page="handlePageChange"
    >
      <template v-slot:day-content="{ day, attributes }">
        <div class="day-content">
          <span class="day-label">{{ day.day }}</span>
          <div class="entry-list">
            <q-scroll-area>
              <div
                  v-for="attr in attributes"
                  :key="attr.key"
                  class="entry-item cursor-pointer overflow-hidden"
                  :style="{
                    background: attr.customData.bgColor,
                    color: attr.customData.fgColor
                  }"
                  @click="handlePreview(attr)"
                  @contextmenu="handleAttrContextMenu(attr)"
              >
                {{ attr.customData.title }}
              </div>
            </q-scroll-area>

          </div>
        </div>
      </template>
    </Calendar>

    <ContextMenuCommon
        :target-data="currentAttr"
        @onPreview="handlePreview"
        @onEdit="handleEdit"
        @onRename="handleRename"
        @onChangeIcon="handleShowChangeIcon"
        @onChangeColor="handleShowChangeColor"
        @onMove="isDialogChooseGroupVisible = true"
        @onDelete="handleDelete"
    />

    <DialogPreviewEntry
        :visible.sync="isDialogPreviewVisible"
        :entry="currentEntry"
    />

    <DialogChooseIcon
        :visible.sync="isDialogChooseIconVisible"
        :index="currentEntry && currentEntry.icon"
        @onChoose="handleUpdateIcon"
    />

    <DialogChooseColor
        :item="currentEntry"
        :visible.sync="isDialogChooseColorVisible"
        @onChoose="handleUpdateColor"
    />

    <DialogChooseGroup
        :visible.sync="isDialogChooseGroupVisible"
        @onChoose="handleMoveEntry"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import Calendar from 'v-calendar/lib/components/calendar.umd'
import store from "@/store"

import ContextMenuCommon from "@/components/ContextMenuCommon"
import DialogPreviewEntry from "@/components/DialogPreviewEntry"
import DialogChooseIcon from "@/components/DialogChooseIcon"
import DialogChooseColor from "@/components/DialogChooseColor"
import DialogChooseGroup from "@/components/DialogChooseGroup"
import {handleCommonDelete, handleCommonRename} from "@/views/Home/common-action"
import {moveItems} from "@/utils/kdbx-utils"

Vue.component('calendar', Calendar)

export default {
  name: "CalendarView",
  components: {
    Calendar,
    DialogChooseIcon,
    DialogChooseColor,
    ContextMenuCommon,
    DialogPreviewEntry,
    DialogChooseGroup,
  },
  props: {
    currentGroupUuid: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      initialized: false,
      calendarData: {},
      isDialogPreviewVisible: false,
      isDialogChooseIconVisible: false,
      isDialogChooseColorVisible: false,
      isDialogChooseGroupVisible: false,
      currentEntry: null,
      currentAttr: null,
    }
  },
  watch: {
    currentGroupUuid: {
      handler() {
        this.refreshCalendarData()
      },
      immediate: true
    }
  },
  computed: {
    calendarDate: {
      get: () => store.getters.calendarDate,
      set: val => store.commit('setCalendarDate', val)
    },
    database: {
      get: () => store.getters.database
    },
    isDarkMode: {
      get: () => store.getters.isDarkMode,
    },
    locate: {
      get: () => store.getters.locate,
    },
    calendarAttributesRaw() {
      const date = this.calendarDate

      if (!date || !this.calendarData) {
        return []
      }

      const year = date.getFullYear()
      const month = date.getMonth()

      // console.log(year, month)

      const list = this.calendarData[year] && this.calendarData[year][month]

      return list || []
    },
    calendarAttributes() {
      return this.calendarAttributesRaw.map((entry, index) => {
        return {
          key: index,
          customData: {
            title: entry.fields.Title,
            fgColor: entry.fgColor,
            bgColor: entry.bgColor,
          },
          dates: entry.times.creationTime
        }
      })
    }
  },
  mounted() {
    this.initCalendar()
  },
  methods: {
    initCalendar() {
      const calendar = this.$refs.calendar

      const date = this.calendarDate
      const year = date.getFullYear()
      const month = date.getMonth()

      calendar.move({month: month, year: year})
      this.calendarDate = new Date(year, month, 1)
      this.initialized = true
    },
    handlePageChange({year, month}) {
      if (!this.initialized) return
      console.log('handlePageChange', year, month)
      this.calendarDate = new Date(year, month, 1)
    },
    refreshCalendarData() {
      if (!this.database || !this.currentGroupUuid) {
        return null
      }

      const data = {}
      const group = this.database.getGroup(this.currentGroupUuid)

      let creationTime, year, month;

      // Recursive traverse，will be called for each entry or group
      group.forEach((entry) => {
        if (entry) {
          creationTime = entry.times.creationTime
          year = creationTime.getFullYear()
          month = creationTime.getMonth() + 1

          // 初始化
          if (!data[year]) data[year] = {}
          if (!data[year][month]) data[year][month] = []

          data[year][month].push(entry)
        }
      });

      this.calendarData = data
    },
    getEntry(attr) {
      return this.calendarAttributesRaw[attr.key]
    },
    handleAttrContextMenu(attr) {
      this.currentAttr = attr
      this.currentEntry = this.getEntry(attr)
    },
    handlePreview(attr) {
      this.currentEntry = this.getEntry(attr)
      this.isDialogPreviewVisible = true
    },
    handleEdit(attr) {
      store.commit('setCurrentEntry', this.getEntry(attr))
      this.$router.push({
        name: 'Detail'
      })
    },
    handleRename(attr) {
      handleCommonRename(this, {
        title: attr.customData.title,
        _origin: this.getEntry(attr)
      }).then(data => {
        attr.customData.title = data
      })
    },
    handleShowChangeIcon(attr) {
      this.currentEntry = this.getEntry(attr)
      this.isDialogChooseIconVisible = true
    },
    handleUpdateIcon(iconIndex) {
      this.currentEntry.icon = iconIndex
      store.commit('setIsNotSave')
    },
    handleShowChangeColor(attr) {
      this.currentAttr = attr
      this.currentEntry = this.getEntry(attr)
      this.isDialogChooseColorVisible = true
    },
    handleUpdateColor(result) {
      const {type, value} = result
      this.currentAttr.customData[type] = value
      this.currentEntry[type] = value
      store.commit('setIsNotSave')
    },
    handleMoveEntry(groupUuid) {
      const result = moveItems(this.database, this.currentEntry, groupUuid)
      if (result) {
        this.refreshCalendarData()
      }
    },
    handleDelete() {
      handleCommonDelete(this, this.currentEntry).then(() => {
        this.refreshCalendarData()
      })
    },
  }
}
</script>

<style lang="stylus" scoped>
.calendar-view {
  >>> .vc-container {
    --day-border: 1px solid rgba(160, 174, 192, 0.5);
    --day-width: 100px;
    --day-height: 100px;
    width: 100%;

    & .vc-header {
      padding: 10px 0;
    }

    & .vc-weeks {
      padding: 0;
    }

    & .vc-weekday {
      border-bottom: var(--day-border);
      border-top: var(--day-border);
      padding: 5px 0;
    }

    & .vc-day {

      text-align: left;
      height: var(--day-height);
      min-width: var(--day-width);

      &.weekday-1,
      &.weekday-7 {
        background-color: rgba(239, 248, 255, 0.2);
      }

      &:not(.on-bottom) {
        border-bottom: var(--day-border);

        &.weekday-1 {
        }
      }

      &:not(.on-right) {
        border-right: var(--day-border);
      }
    }

    .on-left {
      margin-right: 0;
    }

    .on-right {
      margin-left: 0;
    }

    & .vc-day-dots {
      margin-bottom: 5px;
    }

  }

  >>> .vc-container {
    .day-content {
      display flex
      flex-direction column
      height: 100%;
      overflow: hidden;
      z-index: 10;

      .day-label {
        font-size: 12px
        padding 2px 4px
      }

      .entry-list {
        overflow: auto;
        flex-grow: 1
        padding 2px 4px

        .q-scrollarea {
          height: 100%;
          width: 100%;
        }
      }

      .entry-item {
        font-size: 12px
        border-radius 3px
        padding 4px
        line-height: 1.2
        border var(--day-border)

        &:hover {
          opacity 0.8
        }

        & + .entry-item {
          margin-top: 4px
        }
      }
    }
  }
}

</style>
