<template>
  <div
    class="login-view full-height flex justify-center items-center"
  >
    <TkLoading :visible="isLoading" fixed/>

    <TkModalDialog v-model="isShowAlertDialog">
      <TkCard>
        <h2>{{ alertDialog.title || 'Error' }}</h2>

        <p>{{ alertDialog.content }}</p>

        <div>
          <TkButton label="OK" @click="isShowAlertDialog = false"/>
        </div>
      </TkCard>
    </TkModalDialog>

    <TkCard solid class="login-card-main">
      <div class="header-area text-center">
        <TkButton
          v-show="!isWelcome"
          size="no-style"
          class="btn-back"
          @click="isWelcome = true"
        >
          <i class="material-icons">arrow_back</i>
        </TkButton>

        <div class="logo-icon">
          <i class="material-icons">lock</i>
        </div>

        <div class="_title">{{
          isWelcome ? $t('login.welcome') : $t('login.openDatabase')
        }}
        </div>
      </div>

      <div v-show="isWelcome">
        <div class="buttons-row">
          <TkButton
            size="lg"
            class="full-width"
            :label="$t('login.openDatabase')"
            @click="chooseNewKdbx"
          />
          <TkLink
            href="https://keepass.info/help/base/firststeps.html"
            target="_blank"
          >Create Database...</TkLink>
        </div>
        <TkCard>
          <div class="history-actions">
            <TkSwitch v-model="isSaveHistory">{{ $t('login.saveHistory') }}</TkSwitch>
            <TkButton
              v-show="recentList.length > 0"
              size="sm"
              :label="$t('login.clear')"
              @click="handleClearRecent"
            />
          </div>
          <div class="history-list">
            <div
              v-for="(item, index) in recentList"
              :key="index"
              class="list-item"
              @click="openRecentItem(item)"
            >

              <span class="text-overflow" :title="item.dbPath">
                {{ item.dbPath }}
              </span>
              <TkButton
                label="✖"
                size="xs"
                @click.stop="removeRecentItem(item)"
              />
            </div>

            <TkEmpty v-if="recentList.length === 0" :text="$t('login.noRecent')"></TkEmpty>
          </div>
        </TkCard>
      </div>

      <div v-show="!isWelcome">
        <form
          @submit.prevent="handleUnlock"
        >
          <TkCard class="form-card">
            <div class="input-row">
              <TkInput
                v-model="form.dbPath"
                readonly
                type="text"
                placeholder="Database file path"
              />
            </div>

            <div class="input-row">
              <TkInput
                v-model="form.password"
                type="password"
                :placeholder="$t('login.password')"
                autofocus
              />
            </div>

            <div class="input-row">
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
                class="btn-choose"
                size="no-style"
                @click="handleChooseFile('keyPath', [
                  {name: 'All', extensions: ['*']},
                  {name: '*.key', extensions: ['key']},
                ])"
              ><i class="material-icons">attachment</i>
              </TkButton>
            </div>

            <div class="input-row">
              <TkButton
                size="lg"
                type="submit"
                class="btn-submit"
                :label="$t('login.unlock')"
              />
            </div>
          </TkCard>
        </form>

      </div>

      <div class="version-wrap text-center">
        <VersionText/>
      </div>
    </TkCard>
  </div>
</template>

<script>

import LocalStorageSettings from '@/utils/settings'
import {isProd} from '@/utils/is'
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
      const results = await window.electronAPI.showFileChooser({filters})
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
        this.$toast.error({message: 'The database path cannot be empty'})
        return
      }
      if (!password && !keyPath) {
        this.$toast.error({message: 'Password or key path cannot be empty'})
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
.login-view {
  .login-card-main {
    width: 400px;

    @media screen and (max-width: 400px) {
      width: 95%;
    }
  }

  .header-area {
    position: relative;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .logo-icon {
      margin-bottom: 8px;

      i {
        font-size: 32px;
      }
    }

    .btn-back {
      position: absolute;
      top: 0;
      left: 0;
    }

    ._title {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .form-card {
    .input-row {
      width: 100%;
      display: flex;

      input {
        flex: 1;
      }

      & + .input-row {
        margin-top: 10px;
      }

      .btn-choose {
        margin-left: 10px;
      }

      .btn-submit {
        width: 100%;
      }
    }
  }

  .buttons-row {
    padding: 10px 0 20px;

    button, a {
      width: 100%;
    }

    a {
      text-align: center;
      color: inherit;
      margin-top: 10px;
      font-size: 12px;
    }
  }

  .history-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .history-list {
    margin-top: 10px;

    .list-item {
      cursor: pointer;
      display: flex;
      align-items: center;
      overflow: hidden;
      padding: 5px 5px;
      border-top: $layout-border;

      &:hover {
        background-color: $border-color;
      }
    }
  }

  .version-wrap {
    margin-top: 20px;
  }
}

</style>
