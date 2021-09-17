<template>
  <div class="default-layout">

    <NavHeader
      title="KeeNote"
      @onMenuClick="leftDrawerOpen = !leftDrawerOpen"
      @onBackClick="handleBack"
    />

    <NavDrawer v-model="leftDrawerOpen"/>

    <div class="default-layout-content">
      <keep-alive :include="['HomeView']">
        <router-view/>
      </keep-alive>
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

  .default-layout-content {
    flex: 1;
  }
}
</style>

