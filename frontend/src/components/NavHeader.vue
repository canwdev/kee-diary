<template>
  <div class="default-header">
    <TkNavBar>
      <template slot="left">
        <div class="header-left actions-btn-wrap">
          <TkButton
            label="Menu"
            @click="$emit('onMenuClick')"
          />
          <TkButton
            v-show="isShowBack"
            label="Back"
            @click="$emit('onBackClick')"
          />

          <div class="title-wrap">
            <span class="main-title">{{ title }}</span>
            {{ isUnlocked ? $t('header.unlocked') : '' }}
          </div>

        </div>

      </template>
      <template slot="center">
        <div class="header-center actions-btn-wrap flex items-center justify-end">
          <template v-if="isUnlocked">

            <TkButton
              :disabled="!isChanged"
              @click="saveKdbx"
            >
              {{ $t('header.save') }} (Ctrl+S)
            </TkButton>
            <TkButton
              @click="closeKdbx"
            >
              {{ $t('header.close') }} (Ctrl+L)
            </TkButton>
          </template>
        </div>
      </template>
      <template slot="right">
        <template v-if="isUnlocked">
          <TkButton
            @click="isDialogSearchVisible = true"
          >
            {{ $t('header.search') }}
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
import store from '@/store'
import {closeDatabase, checkIsOpen, handleSaveDatabase} from '@/api'
// import DialogSearch from './DialogSearch'

export default {
  name: 'NavHeader',
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
    isDarkMode: {
      get: () => store.getters.isDarkMode
    },
    isUnlocked: {
      get: () => store.state.isUnlocked
    },
    isChanged: {
      get: () => store.state.isChanged
    },
    isShowBack() {
      const r = this.$route.name
      return r !== 'Home' && r !== 'Login'
    }
  },
  methods: {
    async closeKdbx() {
      await closeDatabase()
      store.commit('setIsUnlocked', false)
      await this.$router.replace({
        name: 'Login'
      })
    },
    saveKdbx() {
      handleSaveDatabase()
    }
  }
}
</script>

<style lang="scss" scoped>

.default-header {
  .header-left {
    display: flex;
    align-items: center;

    .title-wrap {
      margin-left: 10px;

      .main-title {
        font-weight: bold;
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
