<template>
  <q-header elevated class="">
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
        {{ title }} <span style="font-size: 12px">{{ isUnlocked ? $t('header.unlocked') : '' }}</span>
      </q-toolbar-title>

      <template v-if="isUnlocked">
        <q-btn
            @click="isDialogSearchVisible = true"
            flat round icon="search">
          <q-tooltip>
            {{ $t('header.search') }}
          </q-tooltip>
        </q-btn>
        <q-btn
            @click="saveKdbx"
            :disable="!isNotSave"
            flat round icon="save">
          <q-tooltip>{{ $t('header.save') }} (Ctrl+S)</q-tooltip>
        </q-btn>
        <q-btn
            @click="closeKdbx"
            flat round icon="eject">
          <q-tooltip>{{ $t('header.close') }} (Ctrl+L)</q-tooltip>
        </q-btn>
      </template>

    </q-toolbar>

    <DialogSearch
      :visible.sync="isDialogSearchVisible"
    />
  </q-header>
</template>

<script>
import store from "@/store"
import {closeKdbx, saveKdbx} from "../utils/kdbx-utils"
import DialogSearch from "./DialogSearch"

export default {
  name: "DefaultHeader",
  components: {
    DialogSearch
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isDialogSearchVisible: false
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
    closeKdbx() {
      closeKdbx()
    },
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
