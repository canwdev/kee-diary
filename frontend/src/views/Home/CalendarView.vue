<script src="../../lang/messages/en.js"></script>
<template>
  <div class="calendar-view q-px-md q-py-lg">
    <Calendar
        is-expanded
        :locale="locate"
        :is-dark="isDarkMode"
        :attributes="attributes"
        disable-page-swipe
    >
      <template v-slot:day-content="{ day, attributes }">
        <div class="day-content">
          <span class="day-label">{{ day.day }}</span>
          <div class="entry-list">
            <div
                v-for="(attr,i) in attributes"
                :key="i"
                class="entry-item"
                :class="attr.customData.class"
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
  data() {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    return {
      attributes: [
        {
          key: 1,
          customData: {
            title: 'Lunch with mom.',
            class: 'bg-red-6 text-white',
          },
          dates: new Date(year, month, 1),
        },
        {
          key: 2,
          customData: {
            title: 'Take Noah to basketball practice',
            class: 'bg-blue-5 text-white',
          },
          dates: new Date(year, month, 2),
        },
        {
          key: 311,
          customData: {
            title: "Noah's basketball2 game.",
            class: 'bg-blue-5 text-white',
          },
          dates: new Date(year, month, 5),
        },
        {
          key: 322,
          customData: {
            title: "Noah's basketball3 game.",
            class: 'bg-blue-5 text-white',
          },
          dates: new Date(year, month, 5),
        },
        {
          key: 3,
          customData: {
            title: "Noah's basketball game.",
            class: 'bg-blue-5 text-white',
          },
          dates: new Date(year, month, 5),
        },
        {
          key: 4,
          customData: {
            title: 'Take car to the shop',
            class: 'bg-indigo-5 text-white',
          },
          dates: new Date(year, month, 5),
        },
        {
          key: 4,
          customData: {
            title: 'Meeting with new client.',
            class: 'bg-teal-5 text-white',
          },
          dates: new Date(year, month, 7),
        },
        {
          key: 5,
          customData: {
            title: "Mia's gymnastics practice.",
            class: 'bg-pink-5 text-white',
          },
          dates: new Date(year, month, 11),
        },
        {
          key: 6,
          customData: {
            title: 'Cookout with friends.',
            class: 'bg-orange-5 text-white',
          },
          dates: {months: 5, ordinalWeekdays: {2: 1}},
        },
        {
          key: 7,
          customData: {
            title: "Mia's gymnastics recital.",
            class: 'bg-pink-5 text-white',
          },
          dates: new Date(year, month, 22),
        },
        {
          key: 8,
          customData: {
            title: 'Visit great grandma.',
            class: 'bg-red-6 text-white',
          },
          dates: new Date(year, month, 25),
        },
      ],
    }
  },
  computed: {
    isDarkMode: {
      get: () => store.getters.isDarkMode,
    },
    locate: {
      get: () => store.getters.locate,
    },
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
      padding: 0 5px 3px 5px;
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
      }

      .entry-list {
        overflow: auto;
        flex-grow: 1
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
