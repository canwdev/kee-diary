<template>
  <div class="default-header" :class="{'is-maximized': isMaximized}">
    <TkNavBar full-width>
      <template slot="left">
        <div class="header-left actions-btn-wrap">
          <TkButton
            round
            flat
            @click="$emit('onMenuClick')"
          >
            <i class="material-icons">menu</i>
          </TkButton>
          <TkButton
            v-show="isShowBack"
            title="Back"
            round
            flat
            @click="$emit('onBackClick')"
          >
            <i class="material-icons text-lg">arrow_back</i>
          </TkButton>

          <div class="title-wrap">
            <span class="main-title">{{ title }}</span>
            <i v-if="isUnlocked" class="material-icons text-inherit" :title="$t('header.unlocked') ">lock_open</i>
          </div>

        </div>

      </template>
      <template slot="center">
        <div class="header-center actions-btn-wrap flex items-center justify-end">
          <template v-if="isUnlocked">
            <TkButton
              round
              flat
              :title="$t('header.search')"
              @click="isDialogSearchVisible = true"
            >
              <i class="material-icons">search</i>
            </TkButton>
          </template>

          <template v-if="isUnlocked">

            <TkButton
              round
              flat
              :disabled="!isChanged"
              :title="`${$t('header.save')} (Ctrl+S)`"
              @click="saveKdbx"
            >
              <i class="material-icons">save</i>
            </TkButton>
            <TkButton
              round
              flat
              :title="`${$t('header.lock')} (Ctrl+L)`"

              @click="closeKdbx"
            >
              <i class="material-icons">eject</i>
            </TkButton>
          </template>
        </div>
      </template>
      <template slot="right">
        <TkButton
          round
          flat
          @click="handleMinimum"
        >
          <i class="material-icons">minimize</i>
        </TkButton>
        <TkButton
          round
          flat
          @click="handleToggleMaximum"
        >
          <i class="material-icons">{{ isMaximized ? 'fullscreen_exit' : 'fullscreen' }}</i>
        </TkButton>

        <TkButton
          round
          flat
          :title="$t('header.close')"
          @click="handleClose"
        >
          <i class="material-icons">close</i>
        </TkButton>
      </template>
    </TkNavBar>
    <!--    <DialogSearch-->
    <!--      :visible.sync="isDialogSearchVisible"-->
    <!--    />-->
  </div>

</template>

<script>
import {mapGetters} from 'vuex'
import {handleCloseDatabase, handleSaveDatabase} from '@/api'
import WindowFrameMixin from '@/mixins/window-frame-mixin'
// import DialogSearch from './DialogSearch'

export default {
  name: 'NavHeader',
  mixins: [WindowFrameMixin],
  components: {
    // DialogSearch
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
    ...mapGetters([
      'isDarkMode', 'isUnlocked', 'isChanged'
    ]),
    isShowBack() {
      const r = this.$route.name
      return r !== 'Home' && r !== 'Login'
    }
  },
  methods: {
    closeKdbx() {
      handleCloseDatabase()
    },
    saveKdbx() {
      handleSaveDatabase()
    }
  }
}
</script>

<style lang="scss" scoped>

.default-header {
  -webkit-user-select: none;

  ::v-deep .tk-navbar {
    -webkit-app-region: drag;
    button {
      -webkit-app-region: no-drag;
    }
    .nav-right {
      margin-left: 20px;
    }
  }

  .header-left {
    display: flex;
    align-items: center;

    .title-wrap {
      margin-left: 10px;
      display: flex;
      align-items: center;

      .main-title {
        font-weight: bold;
        margin-right: 5px
      }
    }
  }

  .actions-btn-wrap {
    button + button {
      margin-left: 10px;
    }
  }

  .header-center {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

}
</style>
