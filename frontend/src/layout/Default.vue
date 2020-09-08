<template>
  <q-layout view="lHh Lpr lFf">
    <q-inner-loading class="_loading" :showing="isGlobalLoading">
      <q-spinner-gears
          color="primary"
          size="5em"
      />
    </q-inner-loading>

    <DefaultHeader
        :title="pkg.name"
        @onMenuClick="leftDrawerOpen = !leftDrawerOpen"
        @onBackClick="handleBack"
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
import {registerKeyShortcuts, unRegisterKeyShortcuts} from "@/utils/key-shortcuts"

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
    },
    isGlobalLoading() {
      return this.$store.getters.isGlobalLoading
    }
  },
  mounted() {
    registerKeyShortcuts()
  },
  beforeDestroy() {
    unRegisterKeyShortcuts()
  },
  methods: {
    handleBack() {
      this.$router.push({
        name: 'Home'
      })
    }
  }
}
</script>

<style scoped>
._loading {
  z-index: 3000;
}
</style>
