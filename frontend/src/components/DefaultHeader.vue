<template>
  <div class="default-header">
    <TkNavBar
        :menu="[
        {title: title},
        {title: isUnlocked ? $t('header.unlocked') : '' }
      ]"
    >
      <template slot="left">
        <TkButton
            v-show="isShowBack"
            label="Back"
            @click="$emit('onBackClick')"
        />
        <TkButton
            label="Menu"
            @click="$emit('onMenuClick')"
        />
      </template>
      <template slot="right">
        <div class="flex items-center justify-end">
          <template v-if="isUnlocked">
            <TkButton
                @click="isDialogSearchVisible = true"
            >
              {{ $t('header.search') }}
            </TkButton>
            <TkButton
                :disabled="!isNotSave"
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
import {closeKdbx, saveKdbx} from '../utils/kdbx-utils'
import DialogSearch from './DialogSearch'

export default {
  name: 'DefaultHeader',
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
    isNotSave: {
      get: () => store.getters.isNotSave
    },
    isShowBack() {
      const r = this.$route.name
      return r !== 'Home' && r !== 'Login'
    }
  },
  methods: {
    closeKdbx() {
      closeKdbx()
    },
    saveKdbx
  }
}
</script>

<style lang="scss" scoped>

.home-header {
  .main-title {
    font-weight: bold;
  }
}
</style>
