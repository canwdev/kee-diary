<template>
  <div class="default-header">
    <TkNavBar>
      <template slot="left">
        <div class="actions-btn">
          <TkButton
            label="Menu"
            @click="$emit('onMenuClick')"
          />
          <TkButton
            v-show="isShowBack"
            label="Back"
            @click="$emit('onBackClick')"
          />
        </div>

      </template>
      <template slot="center">
        <div class="main-title">{{ title }}</div>
        {{ isUnlocked ? $t('header.unlocked') : '' }}
      </template>
      <template slot="right">
        <div class="actions-btn flex items-center justify-end">
          <template v-if="isUnlocked">
            <TkButton
              @click="isDialogSearchVisible = true"
            >
              {{ $t('header.search') }}
            </TkButton>
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
    </TkNavBar>
    <DialogSearch
      :visible.sync="isDialogSearchVisible"
    />
  </div>

</template>

<script>
import store from '@/store'
import {closeDatabase, checkIsOpen, handleSaveDatabase} from '@/api'
import DialogSearch from './DialogSearch'

export default {
  name: 'NavHeader',
  components: {
    DialogSearch
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
      get: () => store.getters.isUnlocked
    },
    isChanged: {
      get: () => store.getters.isChanged
    },
    isShowBack() {
      const r = this.$route.name
      return r !== 'Home' && r !== 'Login'
    }
  },
  methods: {
    async closeKdbx() {
      await closeDatabase()
      store.commit('setIsUnlocked', checkIsOpen())
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
  .main-title {
    font-weight: bold;
  }

  .actions-btn {
    button + button {
      margin-left: 10px;
    }
  }
}
</style>
