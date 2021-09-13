<template>
  <div
    class="full-height row justify-center items-center"
  >
    <TkLoading class="_loading" :visible="isLoading" fixed/>

    <TkModalDialog v-show="isShowAlertDialog">
      <TkCard>
        <h2>{{ alertDialog.title || 'Error' }}</h2>

        <p>{{ alertDialog.content }}</p>

        <div>
          <TkButton label="OK" @click="isShowAlertDialog = false"/>
        </div>
      </TkCard>
    </TkModalDialog>

    <TkCard solid style="width:400px;">
      <TkCard class=" text-center">
        <TkButton
          v-show="!isWelcome"
          class="absolute-top-left"
          @click="isWelcome = true"
        >Back
        </TkButton>

        <h4>{{
            isWelcome ? $t('login.welcome') : $t('login.openDatabase')
          }}</h4>
      </TkCard>

      <div v-show="isWelcome">
        <TkCard>
          <TkButton
            unelevated
            size="md"
            color="secondary"
            class="full-width "
            :label="$t('login.openDatabase')"
            @click="chooseNewKdbx"
          />
        </TkCard>

        <TkCard>
          <div>
            <TkSwitch v-model="isSaveHistory">{{ $t('login.saveHistory') }}</TkSwitch>
            <TkButton
              v-show="recentList.length > 0"
              dense
              flat
              :label="$t('login.clear')"
              @click="handleClearRecent"
            />
          </div>
          <ul>
            <li
              v-for="(item, index) in recentList"
              :key="index"
              class="cursor-pointer"
              @click="openRecentItem(item)"
            >

              <span class="text-overflow" :title="item.dbPath">
                {{ item.dbPath }}
              </span>
              <TkButton
                label="X"
                @click.stop="removeRecentItem(item)"
              />
            </li>

            <li v-if="recentList.length === 0">{{ $t('login.noRecent') }}</li>
          </ul>
        </TkCard>
      </div>

      <div v-show="!isWelcome">
        <form
          @submit="handleUnlock"
        >
          <TkCard>

            <TkInput
              v-model="form.dbPath"
              readonly
              type="text"
              placeholder="Database file path"
            >
            </TkInput>
            <TkInput
              v-model="form.password"
              type="password"
              :placeholder="$t('login.password')"
              autofocus
            >
            </TkInput>
            <div>
              <TkInput
                v-model="form.keyPath"
                clearable
                readonly
                type="text"
                :placeholder="$t('login.keyFilePath')"
              >
              </TkInput>
              <TkButton
                type="button"
                @click="handleChooseFile('keyPath', [
                  {name: 'All', extensions: ['*']},
                  {name: '*.key', extensions: ['key']},
                ])"
              >Choose
              </TkButton>
            </div>
          </TkCard>

          <TkCard>
            <TkButton
              type="submit"
              unelevated
              size="md"
              color="secondary"
              class="full-width "
              :label="$t('login.unlock')"
            />
          </TkCard>
        </form>
      </div>

      <div class="text-center">
        <p>
          <VersionText/>
        </p>
      </div>
    </TkCard>
  </div>
</template>

<script>

import LocalStorageSettings from '@/utils/settings'
import {isProd} from '@/utils/is'
import {notifyError} from '@/utils'
import {kdbxFilters, KEE_DIARY_VUE_LOGIN} from '@/enum'
import VersionText from '@/components/VersionText'
import {
  openDatabase,
  checkIsOpen
} from '@/api'
import store from '@/store'

const settingsLogin = new LocalStorageSettings(KEE_DIARY_VUE_LOGIN)

export default {
  name: 'Login',
  components: {
    VersionText
  },
  data() {
    return {
      isWelcome: true,
      isLoading: false,
      isShowAlertDialog: false,
      alertDialog: {
        title: 'Alert',
        content: 'Content'
      },
      form: {
        dbPath: '',
        keyPath: '',
        password: '',
      },
      isSaveHistory: false,
      recentList: []
    }
  },
  created() {
    this.loadSettings()
    if (this.recentList.length > 0) {
      this.openRecentItem(this.recentList[0])
    }
  },
  mounted() {
  },
  methods: {
    loadSettings() {
      const {
        recentList = [],
        isSaveHistory = true,
      } = settingsLogin.get() || {}
      this.recentList = recentList
      this.isSaveHistory = isSaveHistory
    },
    handleClearRecent() {
      this.recentList = []
      this.saveSettings()
    },
    saveSettings() {
      const settings = {
        recentList: this.recentList,
        isSaveHistory: this.isSaveHistory
      }
      settingsLogin.set(settings)
    },
    async chooseNewKdbx() {
      const result = await this.handleChooseFile('dbPath', kdbxFilters)

      if (result) {
        this.isWelcome = false
        this.form.password = ''
        this.form.keyPath = ''
      }
    },
    /**
     * Select the file
     * name：Target form name
     * filters：File filter: [{name: 'KeePass KDBX 文件', extensions: ['kdbx']}]
     **/
    async handleChooseFile(name, filters) {
      this.$store.commit('setIsGlobalLoading')
      const results = await window.electronAPI.showFileChooser({filters})
      this.$store.commit('setIsGlobalLoading', false)
      // console.log(results)
      if (results && results[0]) {
        this.form[name] = results[0]
        return true
      }
      return false
    },
    openRecentItem(item) {
      const {
        dbPath,
        keyPath,
        password
      } = item
      this.form.dbPath = dbPath
      this.form.keyPath = keyPath
      this.form.password = isProd ? '' : password

      this.isWelcome = false
    },
    removeRecentItem(item) {
      const index = this.recentList.findIndex(i => i.dbPath === item.dbPath)
      if (index !== -1) {
        this.recentList.splice(index, 1)
        this.saveSettings()
      }
    },
    async handleUnlock() {
      const {dbPath, password, keyPath} = this.form
      if (!dbPath) {
        notifyError('The database path cannot be empty')
        return
      }
      if (!password && !keyPath) {
        notifyError('Password or key path cannot be empty')
        return
      }

      try {
        this.isLoading = true
        await openDatabase({dbPath, password, keyPath})

        // save recent settings
        if (this.isSaveHistory && !!this.form.dbPath) {
          const formCopy = {...this.form}
          if (isProd) {
            delete formCopy.password
          }
          const index = this.recentList.findIndex(i => i.dbPath === formCopy.dbPath)
          if (index !== -1) {
            this.recentList.splice(index, 1)
          }
          this.recentList.unshift(formCopy)

          this.saveSettings()
        }

        store.commit('setIsUnlocked', true)
        await this.$router.replace({
          name: 'Home'
        })
      } catch (e) {
        console.error(e)
        this.isShowAlertDialog = true
        this.alertDialog = {
          title: e.code,
          content: e.message
        }
      } finally {
        this.isLoading = false
      }
    },
  }
}
</script>

<style lang="scss" scoped>
._loading {
  z-index: 10;
}

.q-item__section--avatar {
  min-width: 32px;
}

.single-line-hide {
  display: block;
  max-width: 100%;
}
</style>
