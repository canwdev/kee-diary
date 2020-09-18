<template>
  <q-page
      class="row justify-center items-center"
  >
    <q-inner-loading class="_loading" :showing="isLoading">
      <q-spinner-gears
          color="secondary"
          size="5em"
      />
    </q-inner-loading>

    <q-dialog v-model="isShowAlertDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="error"/>
          <span class="text-h6">{{ alertDialog.title || 'Error' }}</span>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ alertDialog.content }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="column q-pa-lg">
      <div class="row">
        <q-card class="shadow-10" style="width:400px;">
          <q-card-section class="bg-primary bg-wood text-center">
            <q-btn
                @click="isWelcome = true"
                v-show="!isWelcome"
                icon="arrow_back" text-color="white" flat round class="absolute-top-left"/>

            <q-avatar size="64px" color="white">
              <q-icon name="lock" color="primary"/>
            </q-avatar>

            <h4 class="text-h5 text-white q-mb-none q-mt-md">{{
                isWelcome ? 'Welcome to KeeDiary' : 'Open KDBX database'
              }}</h4>
          </q-card-section>

          <div v-show="isWelcome">
            <q-card-actions class="q-px-md">
              <q-btn
                  @click="chooseNewKdbx"
                  unelevated size="md"
                  color="secondary"
                  class="full-width text-white"
                  label="Open database"
              />
            </q-card-actions>

            <q-card-section class="q-pt-xs">
              <div class="row q-mb-xs">
                <q-checkbox dense v-model="isSaveHistory" label="Save history"/>
                <q-space/>
                <q-btn
                    v-show="recentList.length > 0"
                    @click="saveSettings(true)"
                    dense flat label="Clear"/>
              </div>
              <q-list dense bordered padding class="rounded-borders" style="height: 150px; overflow: auto">
                <q-item
                    clickable
                    v-ripple
                    v-for="(item, index) in recentList"
                    :key="index"
                    @click="openRecentItem(item)"
                >
                  <q-item-section avatar>
                    <q-icon color="secondary" name="lock"/>
                  </q-item-section>
                  <q-item-section>
                      <span class="single-line-hide" :title="item.dbPath">
                      {{ item.dbPath }}
                      </span>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                        @click.stop="removeRecentItem(item)"
                        dense flat icon="close" color="secondary"/>
                  </q-item-section>
                </q-item>

                <q-item class="text-grey" v-if="recentList.length === 0">No recent item</q-item>
              </q-list>
            </q-card-section>
          </div>

          <div v-show="!isWelcome">
            <q-form
                class="q-px-md"
                @submit="handleUnlock">
              <q-card-section
                  class="q-px-sm q-gutter-y-sm q-pt-md">

                <q-input
                    outlined dense readonly v-model="form.dbPath" type="text" placeholder="Database file path">
                  <template v-slot:prepend>
                    <q-icon name="lock"/>
                  </template>
                </q-input>
                <q-input outlined dense clearable v-model="form.password" type="password" placeholder="Password" autofocus>
                  <template v-slot:prepend>
                    <q-icon name="vpn_key"/>
                  </template>
                </q-input>
                <q-input outlined dense clearable v-model="form.keyPath" type="text"
                         placeholder="Key file path (optional)">
                  <template v-slot:prepend>
                    <q-icon name="vpn_key"/>
                  </template>
                  <template v-slot:after>
                    <q-btn
                        @click="handleChooseFile('keyPath', [
                          {name: 'All', extensions: ['*']},
                          {name: '*.key', extensions: ['key']},
                        ])"

                        outline icon="attachment"/>
                  </template>
                </q-input>
              </q-card-section>

              <q-card-actions>
                <q-btn
                    type="submit"
                    unelevated size="md" color="secondary" class="full-width text-white" label="Unlock"/>
              </q-card-actions>
            </q-form>
          </div>

          <q-card-section class="text-center q-pa-sm">
            <p class="text-grey-6 q-mb-none">
              © {{ new Date().getFullYear() }} {{ pkg.appName }} {{ pkg.version }} by {{ pkg.author }}
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import {decryptKdbx, openKdbx} from "@/utils/kdbx-utils"
import LocalStorageSettings from "@/utils/settings"
import {isProd} from "@/utils/is"
import {notifyError} from "@/utils"
import {kdbxFilters, KEE_DIARY_VUE_LOGIN} from "@/utils/enum"

const settingsLogin = new LocalStorageSettings(KEE_DIARY_VUE_LOGIN)

export default {
  name: 'Login',
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
  computed: {
    pkg() {
      return this.$store.getters.pkg
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
    saveSettings(isClearRecent = false) {
      const settings = {
        recentList: this.recentList,
        isSaveHistory: this.isSaveHistory
      }

      if (!isClearRecent && this.isSaveHistory && !!this.form.dbPath) {
        const formCopy = {...this.form}
        if (isProd) {
          delete formCopy.password
        }
        const index = this.recentList.findIndex(i => i.dbPath === formCopy.dbPath)
        if (index !== -1) {
          this.recentList.splice(index, 1)
        }
        this.recentList.unshift(formCopy)
      }
      if (!this.isSaveHistory || isClearRecent) {
        this.recentList = settings.recentList = []
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
      const results = await window.electronAPI.openFileChooser({filters})
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
      this.saveSettings()

      try {
        this.isLoading = true
        const db = await decryptKdbx(dbPath, password, keyPath)

        openKdbx(db, dbPath)
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

<style lang="stylus" scoped>
._loading {
  z-index 10
}



.q-item__section--avatar {
  min-width 32px
}

.single-line-hide {
  display block
  max-width 100%
}
</style>
