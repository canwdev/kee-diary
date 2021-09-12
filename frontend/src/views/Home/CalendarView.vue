<template>
  <div class="calendar-view q-px-md q-py-lg">
    <Calendar
      ref="calendar"
      is-expanded
      :locale="locate"
      :is-dark="isDarkMode"
      :attributes="calendarAttributes"
      :first-day-of-week="1"
      disable-page-swipe
      @update:from-page="handlePageChange"
    >
      <template v-slot:day-content="{ day, attributes }">
        <div class="day-content">
          <div class="entry-list">
            <q-scroll-area>
              <template
                v-for="attr in attributes"
              >
                <div
                  v-if="attr.customData"
                  :key="attr.key"
                  class="entry-item cursor-pointer overflow-hidden"
                  :style="{
                    background: attr.customData.bgColor,
                    color: attr.customData.fgColor
                  }"
                  @click="handlePreview(attr)"
                  @contextmenu="handleAttrContextMenu(attr)"
                >
                  <ItemIcon
                    :item="{iconIndex: attr.customData.iconIndex}"
                    size="16px"
                    :icon-scale="1"
                  />
                  <span class="entry-title">{{ attr.customData.title }}</span>
                </div>
              </template>
            </q-scroll-area>

          </div>
          <span class="day-label-wrap">
            <DayDetail
              v-if="/^zh/i.test($i18n.locale)"
              :lunar-data="getLunarData(day.year, day.month, day.day)"
              class="lunar-label"
            />
            <span class="day-label">{{ day.day }}</span>
          </span>
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
import solarLunar from 'solarlunar'
import store from '@/store'

import ContextMenuCommon from '@/components/ContextMenuCommon'
import DialogChooseIcon from '@/components/DialogChooseIcon'
import DialogChooseColor from '@/components/DialogChooseColor'
import DialogChooseGroup from '@/components/DialogChooseGroup'
import ItemIcon from '@/components/ItemIcon'
import DayDetail from '@/components/DayDetail'

import {handleCommonDelete, handleCommonRename} from '@/views/Home/common-action'
import {moveItems} from '@/utils/kdbx-utils'

Vue.component('calendar', Calendar)

export default {
  name: 'CalendarView',
  components: {
    Calendar,
    DialogChooseIcon,
    DialogChooseColor,
    ContextMenuCommon,
    DialogChooseGroup,
    ItemIcon,
    DayDetail
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
      const month = date.getMonth() + 1

      // console.log('calendarAttributesRaw', year, month)

      const list = this.calendarData[year] && this.calendarData[year][month]

      return list || []
    },
    calendarAttributes() {
      return this.calendarAttributesRaw.map((entry, index) => {
        return {
          key: index,
          customData: {
            iconIndex: entry.icon,
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

      calendar.move({month: month + 1, year: year})
      this.calendarDate = new Date(date) // trigger refresh
      this.initialized = true
    },
    handlePageChange({year, month}) {
      if (!this.initialized) return
      // console.log('handlePageChange', year, month)
      this.calendarDate = new Date(year, month - 1, 1)
    },
    refreshCalendarData() {
      if (!this.database || !this.currentGroupUuid) {
        this.calendarData = null
        return
      }

      const data = {}
      const group = this.database.getGroup(this.currentGroupUuid)

      let creationTime, year, month

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
      })

      this.calendarData = data
    },
    getEntry(attr) {
      return this.calendarAttributesRaw[attr.key]
    },
    getLunarData(year, month, day) {
      return solarLunar.solar2lunar(year, month, day)
    },
    handleAttrContextMenu(attr) {
      this.currentAttr = attr
      this.currentEntry = this.getEntry(attr)
    },
    handleCalendarContextMenu() {
      this.currentAttr = null
      this.currentEntry = null
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
      this.currentAttr.customData.iconIndex = iconIndex
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

<style lang="scss" scoped>
.calendar-view {
  ::v-deep .vc-container {
    --day-border: 1px solid rgba(160, 174, 192, 0.4);
    --day-width: 120px;
    --day-height: 120px;
    width: 100%;

    //@media screen and (max-width: $breakpoint-lg-max) {
    //  --day-width: 100px;
    //  --day-height: 100px;
    //}
    //
    //@media screen and (max-width: $breakpoint-md-max) {
    //  --day-width: 80px;
    //  --day-height: 100px;
    //}
    //
    //@media screen and (max-width: $breakpoint-sm-max) {
    //  --day-width: 60px;
    //  --day-height: 80px;
    //}

    &.vc-is-dark {
      background: black;

      .vc-weekday {
        color: gray;
      }
    }

    .vc-header {
      padding: 10px 0;
    }

    .vc-weeks {
      padding: 0;
    }

    .vc-weekday {
      border-bottom: var(--day-border);
      border-top: var(--day-border);
      padding: 5px 0;
    }

    .vc-day {
      position: relative;
      text-align: left;
      height: var(--day-height);
      min-width: var(--day-width);

      &.weekday-1, &.weekday-7 {
        .lunar-label {
          color: red;
        }

        .day-label {
          color: red;
        }
      }

      &.is-today {
        &:before {
          position: absolute;
          display: block;
          content: '今';
          left: 0;
          bottom: 0;
          color: white;
          width: 18px;
          height: 18px;
          font-size: 12px;
          transform: scale(0.8);
          transform-origin: right top;
          background: red;
          border-radius: 50%;
          text-align: center;
        }

        &:after {
          content: ' ';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: red;
        }
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

    .vc-day-dots {
      margin-bottom: 5px;
    }
  }

  ::v-deep .vc-container {
    border-radius: 0;

    .day-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      z-index: 10;

      .day-label-wrap {
        font-size: 14px;
        padding: 2px 4px;
        text-align: right;

        .lunar-label {
          font-size: 12px;
          margin-right: 4px;
          opacity: 0.8;
        }

        .day-label {
          font-weight: bold;
        }
      }

      .entry-list {
        overflow: auto;
        flex-grow: 1;

        .q-scrollarea {
          height: 100%;
          width: 100%;

          .scroll > .absolute {
            padding: 4px 4px;
          }
        }
      }

      .entry-item {
        font-size: 12px;
        padding: 2px;
        line-height: 1.2;
        box-shadow: 0 0 1px 1px rgba(134, 134, 134, 0.5);

        &:hover {
          opacity: 0.8;
        }

        .q-avatar {
          margin-top: -3px;
        }

        .entry-title {
          display: inline;
          margin-left: 2px;
        }

        & + .entry-item {
          margin-top: 4px;
        }
      }
    }
  }
}

</style>
