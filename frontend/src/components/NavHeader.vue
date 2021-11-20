<template>
  <div class="default-header" :class="{'is-maximized': isMaximized, 'is-macos': isMacOS}">
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
          <!--          <template v-if="isUnlocked">-->
          <!--            <TkButton-->
          <!--              round-->
          <!--              flat-->
          <!--              :title="$t('header.search')"-->
          <!--              @click="isDialogSearchVisible = true"-->
          <!--            >-->
          <!--              <i class="material-icons">search</i>-->
          <!--            </TkButton>-->
          <!--          </template>-->

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
        <template v-if="!isMacOS">
          <TkButton
            round
            flat
            class="btn-window-action"
            @click="handleMinimum"
          >
            <i class="material-icons">minimize</i>
          </TkButton>
          <TkButton
            round
            flat
            class="btn-window-action"
            @click="handleToggleMaximum"
          >
            <i class="material-icons">{{ isMaximized ? 'fullscreen_exit' : 'fullscreen' }}</i>
          </TkButton>
          <TkButton
            round
            flat
            :title="$t('header.close')"
            class="btn-window-action"
            @click="handleClose"
          >
            <i class="material-icons">close</i>
          </TkButton>
        </template>
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
      'isDarkMode',
      'isUnlocked',
      'isChanged',
      'isMacOS',
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
      cursor: default;
      border-radius: $border-radius;
      &:hover {
        background: $border-color;
      }
      -webkit-app-region: no-drag;
    }
    .nav-right {
      margin-left: 20px;
      min-width: 0;
    }
  }

  &.is-macos {
    ::v-deep .tk-navbar {
      .tk-container-wrap {
        flex-direction: row-reverse;
      }
    }
  }

  .header-left {
    display: flex;
    align-items: center;

    .title-wrap {
      margin: 0 10px;
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
    padding: 0 10px;
  }

  &.is-macos {
    .header-left {
      flex-direction: row-reverse;
    }
    .header-center {
      justify-content: flex-start;
    }
    ::v-deep .nav-right {
      padding-left: 50px;
    }
  }


}
</style>
