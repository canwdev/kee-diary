<template>
  <TkDrawer class="custom-drawer" :title="title" :visible.sync="mValue" :menu="menuList">
    <TkButton v-if="isUnlocked" size="no-style" class="menu-item" @click="isListView = !isListView">
      <span class="material-icons">{{ isListView ? 'list' : 'event' }}</span>
      <span class="menu-item-title">
        {{ isListView ? $t('drawer.listView') : $t('drawer.calendarView') }}
        <TkSwitch :value="isListView"/>
      </span>
    </TkButton>

    <TkButton size="no-style" class="menu-item" @click="isDarkMode = !isDarkMode">
      <span class="material-icons">nights_stay</span>
      <span class="menu-item-title">
        {{ $t('drawer.darkMode') }}
        <TkSwitch :value="isDarkMode"/>
      </span>
    </TkButton>

    <TkButton size="no-style cursor-default" class="menu-item">
      <span class="material-icons">color_lens</span>
      <span class="menu-item-title">
        {{ $t('drawer.themeColor') }}
        <input class="tk-button-no-style color-input" type="color" :value="themeColor" @change="handleThemeColorChange">
      </span>
    </TkButton>

    <TkButton size="no-style cursor-default" class="menu-item">
      <span class="material-icons">translate</span>
      <span class="menu-item-title">
        {{ $t('drawer.language') }}
        <TkDropdown
            v-model="locate"
            size="sm"
            :options="languages"
            option-label="name"
            option-value="locate"
        />
      </span>
    </TkButton>
  </TkDrawer>
</template>

<script>
import {mapGetters} from 'vuex'
import languages from '@/lang/languages'
import {hexToRgb} from '@/utils/color'

export default {
  name: 'NavDrawer',
  props: {
    title: {
      type: String,
      default: ''
    },
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
    ...mapGetters([
      'themeColor'
    ]),
    mValue: {
      get() {
        return this.value
      },
      set(nv) {
        return this.$emit('input', nv)
      }
    },
    locate: {
      get() {
        return this.$store.getters.locate
      },
      set(val) {
        this.$store.commit('setLocate', val)
      }
    },
    isDarkMode: {
      get() {
        return this.$store.getters.isDarkMode
      },
      set(val) {
        this.$store.commit('setIsDarkMode', val)
      }
    },
    isUnlocked() {
      return this.$store.state.isUnlocked
    },
    isListView: {
      get() {
        return this.$store.getters.isListView
      },
      set(val) {
        this.$store.commit('setIsListView', val)
      }
    },
    menuList() {
      const iconClass = 'material-icons'
      return [
        {name: this.$t('drawer.navigation'), subtitle: true},
        this.isUnlocked
            ? {
              iconClass,
              iconName: 'home',
              name: this.$t('pages.home'), action: () => {
                this.$router.push({name: 'Home'})
                this.mValue = false
              }
            }
            : {
              iconClass,
              iconName: 'login',
              name: this.$t('login.openDatabase'), action: () => {
                router.push({name: 'Login'})
                this.mValue = false
              }
            },
        {
          iconClass,
          iconName: 'info',
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
    locate: {
      handler(nv) {
        this.$i18n.locale = nv
      },
      immediate: true
    },
  },
  methods: {

    handleThemeColorChange(event) {
      const colorHex = event.target.value
      const {r, g, b} = hexToRgb(colorHex)
      console.log(colorHex)

      const root = document.documentElement
      root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`)
      this.$store.commit('updateSettings', {
        key: 'themeColor',
        value: colorHex
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-drawer {
  $offsetTop: 51px;

  ::v-deep .bg-shade {
    top: $offsetTop;
  }

  ::v-deep .menu-wrap {
    top: $offsetTop;
  }

  button {
    border-radius: 0;
  }

  .color-input {
    width: 30px;
    height: 30px;
    padding: 0;
  }
}
</style>
