<template>
  <div class="calendar-view q-px-md q-py-lg">
    <Calendar
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
            <div
                v-for="attr in attributes"
                :key="attr.key"
                class="entry-item"
                :class="attr.customData.class"
                @click="handleAttrClick(attr)"
            >
              {{ attr.customData.title }}
            </div>
          </div>
        </div>
      </template>
    </Calendar>
  </div>
</template>

<script>
import Vue from 'vue'
import Calendar from 'v-calendar/lib/components/calendar.umd'
import store from "@/store"

Vue.component('calendar', Calendar)

export default {
  name: "CalendarView",
  components: {
    Calendar,
  },
  props: {
    currentGroupUuid: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {}
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
    calendarData() {
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

      return data
    },
    calendarAttributes() {
      const date = this.calendarDate

      if (!date || !this.calendarData) {
        return []
      }

      const year = date.getFullYear()
      const month = date.getMonth()

      // console.log(year, month)

      const list = this.calendarData[year] && this.calendarData[year][month]
      if (!list) {
        return []
      }

      return list.map((entry, index) => {
        return {
          key: index,
          customData: {
            title: entry.fields.Title,
            class: 'bg-blue text-white',
          },
          dates: entry.times.creationTime
        }
      })
    }
  },
  mounted() {
  },
  methods: {
    handlePageChange({year, month}) {
      this.calendarDate = new Date(year, month, 1)
    },
    handleAttrClick(attr) {
      console.log(attr)
    }
  }
}
</script>

<style lang="stylus" scoped>
.calendar-view {
  >>> .vc-container {
    --day-border: 1px solid rgba(160, 174, 192, 0.5);
    --day-width: 90px;
    --day-height: 90px;
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
      }

      .entry-item {
        font-size: 12px
        border-radius 3px
        padding 4px
        line-height: 1.2

        & + .entry-item {
          margin-top: 4px
        }
      }
    }
  }
}

</style>
