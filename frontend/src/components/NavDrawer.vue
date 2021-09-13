<template>
  <TkDrawer :visible.sync="mValue" :menu="menuList">
    <TkButton v-if="isUnlocked" size="no-style" class="menu-item" @click="isListView = !isListView">
      <span class="menu-item-title">
        {{ isListView ? $t('drawer.listView') : $t('drawer.calendarView') }}
        <TkSwitch :value="isListView"/>
      </span>
    </TkButton>

    <TkButton size="no-style" class="menu-item" @click="isDarkMode = !isDarkMode">
      <span class="menu-item-title">
        {{ $t('drawer.darkMode') }}
        <TkSwitch :value="isDarkMode"/>
      </span>
    </TkButton>

    <TkButton size="no-style cursor-default" class="menu-item">
      <span class="menu-item-title">
        {{ $t('drawer.language') }}
        <TkDropdown
          v-model="locate"
          :options="languages"
          option-label="name"
          option-value="locate"
        />
      </span>
    </TkButton>
  </TkDrawer>
</template>

<script>
import store from '@/store'
import router from '@/router'
import languages from '@/lang/languages'

export default {
  name: 'NavDrawer',
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
    },
    menuList() {
      return [
        {name: this.$t('drawer.navigation'), subtitle: true},
        this.isUnlocked
          ? {
            name: this.$t('pages.home'), action: () => {
              router.push({name: 'Home'})
              this.mValue = false
            }
          }
          : {
            name: this.$t('pages.login'), action: () => {
              router.push({name: 'Login'})
              this.mValue = false
            }
          },
        {
          name: this.$t('pages.about'), action: () => {
            router.push({name: 'About'})
            this.mValue = false
          }
        },
        {name: this.$t('drawer.settings'), subtitle: true},
      ]
    }
  },
  watch: {
    isDarkMode: {
      handler(nv) {
        console.log('isDarkMode', nv)
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
