<template>
  <q-header elevated>
    <q-toolbar class="home-header" :class="{'_dark': isDarkMode}">
      <q-btn
          flat
          dense
          round
          @click="$emit('onMenuClick')"
          aria-label="Menu"
          icon="menu"
      />

      <q-toolbar-title class="main-title">
        <!--<q-avatar>
          <img src="./assets/logo.png">
        </q-avatar>-->
        {{ title }}
      </q-toolbar-title>

      <q-btn flat round dense icon="search">
        <q-tooltip>
          Search
        </q-tooltip>
      </q-btn>

      <q-btn flat round dense icon="save">
        <q-tooltip>
          Save
        </q-tooltip>
      </q-btn>

      <q-btn flat round dense icon="eject">
        <q-tooltip>
          Eject
        </q-tooltip>
      </q-btn>

    </q-toolbar>
  </q-header>
</template>

<script>
import store from "@/store"

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
      get: () => store.getters.isDarkMode,
    },
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
