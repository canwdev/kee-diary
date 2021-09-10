<template>
  <TkDrawer :visible.sync="mValue" :menu="[
      {name: $t('drawer.navigation'), subtitle: true},
      {name: $t('drawer.settings'), subtitle: true},
  ]">
    <div v-if="isUnlocked" class="menu-item">
      <TkButton>
        <TkLink href="/home">{{ $t('pages.home') }}</TkLink>
      </TkButton>
    </div>
    <div class="menu-item">
      <TkButton>
        <TkLink href="/login">{{ $t('pages.login') }}</TkLink>
      </TkButton>
    </div>
    <div class="menu-item">
      <TkButton>
        <TkLink href="/about">{{ $t('pages.about') }}</TkLink>
      </TkButton>
    </div>
    <div v-if="isUnlocked" class="menu-item">
      <TkButton @click="isListView = !isListView"> {{
          isListView ? $t('drawer.listView') : $t('drawer.calendarView')
        }}
      </TkButton>
    </div>
    <div class="menu-item">
      <TkButton @click="isDarkMode = !isDarkMode"> {{ $t('drawer.darkMode') }}
        <TkSwitch :value="isDarkMode"/>
      </TkButton>
    </div>

    <div class="menu-item">
      <TkDropdown v-model="locate" :options="languages"/>
    </div>
  </TkDrawer>
</template>

<script>
import store from '@/store'
import languages from '@/lang/languages'

export default {
  name: 'DefaultDrawer',
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
