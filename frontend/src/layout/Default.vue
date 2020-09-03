<template>
  <q-layout view="lHh Lpr lFf">
    <DefaultHeader
        :title="pkg.name"
        @onMenuClick="leftDrawerOpen = !leftDrawerOpen"
    />
    <q-page-container>
      <router-view/>
    </q-page-container>
    <DefaultDrawer v-model="leftDrawerOpen"/>
  </q-layout>
</template>

<script>
import DefaultDrawer from "../components/DefaultDrawer"
import DefaultHeader from "../components/DefaultHeader"

export default {
  name: 'LayoutDefault',
  components: {
    DefaultDrawer,
    DefaultHeader,
  },
  data() {
    return {
      leftDrawerOpen: false
    }
  },
  computed: {
    pkg() {
      return this.$store.getters.pkg
    }
  }
}
</script>

<style>
</style>
