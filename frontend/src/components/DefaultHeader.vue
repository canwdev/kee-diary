<template>
  <q-header elevated>
    <q-toolbar class="home-header" :class="{'_dark': isDarkMode}">
      <q-btn
          flat
          round
          @click="$emit('onMenuClick')"
          aria-label="Menu"
          icon="menu"
      />

      <q-btn
          v-show="isShowBack"
          flat
          round
          @click="$emit('onBackClick')"
          aria-label="Back"
          icon="arrow_back"
      />

      <q-toolbar-title class="main-title">
        {{ title }} <span style="font-size: 12px">{{ isUnlocked ? '(Unlocked)' : '' }}</span>
      </q-toolbar-title>

      <template v-if="isUnlocked">
        <q-btn flat round icon="search">
          <q-tooltip>
            Search
          </q-tooltip>
        </q-btn>
        <q-btn
            @click="saveKdbx"
            :disable="!isNotSave"
            flat round icon="save">
          <q-tooltip>Save</q-tooltip>
        </q-btn>
        <q-btn
            @click="closeKdbx"
            flat round icon="eject">
          <q-tooltip>Eject</q-tooltip>
        </q-btn>
      </template>

    </q-toolbar>
  </q-header>
</template>

<script>
import store from "@/store"
import {closeKdbx, saveKdbx} from "../utils/kdbx-utils"

export default {
  name: "DefaultHeader",
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    isDarkMode: {
      get: () => store.getters.isDarkMode
    },
    isUnlocked: {
      get: () => store.getters.isUnlocked
    },
    isNotSave: {
      get: () => store.getters.isNotSave
    },
    isShowBack() {
      const r = this.$route.name
      return r !== 'Home' && r !== 'Login'
    }
  },
  methods: {
    closeKdbx,
    saveKdbx
  }
}
</script>

<style lang="stylus" scoped>

.home-header {
  .main-title {
    font-weight: bold;
  }
}
</style>
