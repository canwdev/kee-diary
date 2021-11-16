<template>
  <div class="default-layout">
    <TkLoading size="xl" theme="white" :visible="isGlobalLoading" fixed/>

    <NavHeader
      title="KeeNote"
      @onMenuClick="leftDrawerOpen = !leftDrawerOpen"
      @onBackClick="handleBack"
    />

    <NavDrawer
      v-model="leftDrawerOpen"
      title="KeeNote"
      @showThemeSettings="themeSettingsVisible = true"
    />

    <ThemeSettings :visible.sync="themeSettingsVisible"></ThemeSettings>

    <div class="default-layout-content">
      <keep-alive :include="['HomeView']">
        <router-view/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import NavDrawer from '../components/NavDrawer.vue'
import NavHeader from '../components/NavHeader.vue'
import {registerKeyShortcuts, unRegisterKeyShortcuts} from '@/utils/key-shortcuts'
import ThemeSettings from '../components/ThemeSettings'

export default {
  name: 'LayoutDefault',
  components: {
    NavDrawer,
    NavHeader,
    ThemeSettings,
  },
  data() {
    return {
      leftDrawerOpen: false,
      themeSettingsVisible: false
    }
  },
  computed: {
    isGlobalLoading() {
      return this.$store.state.isGlobalLoading
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
  overflow: hidden;

  .default-layout-content {
    flex: 1;
    overflow: hidden;
  }
}
</style>

