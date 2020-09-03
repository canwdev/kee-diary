<template>
  <q-layout view="lHh Lpr lFf">
    <DefaultHeader
        title="KeeDiary"
        @onMenuClick="leftDrawerOpen = !leftDrawerOpen"
    />
    <q-page-container>
      <q-page>
        <router-view/>
      </q-page>
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
  }
}
</script>

<style>
</style>
