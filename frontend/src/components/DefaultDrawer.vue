<template>
  <q-drawer
      v-model="mValue"
      bordered
      overlay
      behavior="mobile"
  >
    <q-scroll-area class="fit">
      <q-list>
        <q-item-label header>{{ $t('drawer.navigation') }}</q-item-label>

        <template v-if="isUnlocked">
          <q-item clickable tag="a" to="/home">
            <q-item-section avatar>
              <q-icon name="home"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ $t('pages.home') }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-else>
          <q-item clickable tag="a" to="/login">
            <q-item-section avatar>
              <q-icon name="login"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ $t('pages.login') }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>


        <q-item clickable tag="a" to="/about">
          <q-item-section avatar>
            <q-icon name="info"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('pages.about') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator/>
        <q-item-label header>{{ $t('drawer.settings') }}</q-item-label>

        <q-item clickable @click="isListView = !isListView">
          <q-item-section avatar>
            <q-icon :name="isListView ? 'list': 'event'"/>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              {{ isListView ? $t('drawer.listView') : $t('drawer.calendarView') }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="isDarkMode = !isDarkMode">
          <q-item-section avatar>
            <q-icon name="nights_stay"/>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              {{ $t('drawer.darkMode') }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-toggle v-model="isDarkMode"/>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon name="translate"/>
          </q-item-section>

          <q-item-section side>
            <q-select
                borderless
                dense
                v-model="locate"
                :options="languages"
                option-value="locate"
                option-label="name"
                emit-value
                map-options
            />
          </q-item-section>
        </q-item>

      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import store from "@/store"
import languages from "@/lang/languages"

export default {
  name: "DefaultDrawer",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      languages: Object.freeze(languages)
    }
  },
  computed: {
    mValue: {
      get() {
        return this.value
      },
      set(nv) {
        return this.$emit('input', nv)
      }
    },
    locate: {
      get: () => store.getters.locate,
      set: val => store.commit('setLocate', val)
    },
    isDarkMode: {
      get: () => store.getters.isDarkMode,
      set: val => store.commit('setIsDarkMode', val)
    },
    isUnlocked: {
      get: () => store.getters.isUnlocked
    },
    isListView: {
      get: () => store.getters.isListView,
      set: val => store.commit('setIsListView', val)
    }
  },
  watch: {
    isDarkMode: {
      handler(nv) {
        this.$q.dark.set(nv)
      },
      immediate: true
    },
    locate: {
      handler(nv) {
        this.$i18n.locale = nv
      },
      immediate: true
    },
  },
  methods: {
    toggleFullscreen() {
    }
  }
}
</script>

<style scoped>

</style>
