<template>
  <div class="default-layout">
    <TkLoading size="xl" theme="white" :visible="isGlobalLoading" fixed/>

    <NavHeader
      title="KeeDiary"
      @onMenuClick="leftDrawerOpen = !leftDrawerOpen"
      @onBackClick="handleBack"
    />

    <NavDrawer v-model="leftDrawerOpen"/>

    <div class="main-content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import NavDrawer from '../components/NavDrawer'
import NavHeader from '../components/NavHeader'
import {registerKeyShortcuts, unRegisterKeyShortcuts} from '@/utils/key-shortcuts'

export default {
  name: 'LayoutDefault',
  components: {
    NavDrawer,
    NavHeader,
  },
  data() {
    return {
      leftDrawerOpen: false
    }
  },
  computed: {
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

<style lang="scss" scoped>
.default-layout {
  height: 100%;
  display: flex;
  flex-direction: column;

  .main-content {
    flex: 1;
  }
}
</style>

