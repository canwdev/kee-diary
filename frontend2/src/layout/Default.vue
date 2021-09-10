<template>
  <div>
    <TkLoading :visible="isGlobalLoading">
    </TkLoading>

    <DefaultHeader
        :title="pkg.appName"
        @onMenuClick="leftDrawerOpen = !leftDrawerOpen"
        @onBackClick="handleBack"
    />
    <router-view/>
    <DefaultDrawer v-model="leftDrawerOpen"/>
  </div>
</template>

<script>
import DefaultDrawer from '../components/DefaultDrawer'
import DefaultHeader from '../components/DefaultHeader'
import {registerKeyShortcuts, unRegisterKeyShortcuts} from '@/utils/key-shortcuts'

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


