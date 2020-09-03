<template>
  <q-page
      class="row justify-center items-center"
  >
    <div class="column q-pa-lg">
      <div class="row">
        <q-card class="shadow-10" style="width:400px;">
          <q-card-section class="bg-primary text-center">
            <q-avatar size="64px" color="white">
              <q-icon name="lock" color="primary"/>
            </q-avatar>

            <h4 class="text-h5 text-white q-my-sm">打开 KDBX 数据库</h4>
          </q-card-section>

          <q-form
              @submit="handleUnlock">
            <q-card-section
                class="q-px-sm q-gutter-y-sm q-pt-md">
              <q-input
                  outlined dense clearable v-model="form.dbPath" type="text" placeholder="数据库文件路径">
                <template v-slot:prepend>
                  <q-icon name="lock"/>
                </template>
                <template v-slot:after>
                  <q-btn
                      @click="handleChooseFile('dbPath', [{name: 'KeePass KDBX 文件', extensions: ['kdbx']}])"
                      outline icon="attachment"/>
                </template>
              </q-input>
              <q-input outlined dense clearable v-model="form.password" type="password" placeholder="Password">
                <template v-slot:prepend>
                  <q-icon name="vpn_key"/>
                </template>
              </q-input>
              <q-input outlined dense clearable v-model="form.keyPath" type="text" placeholder="密钥文件路径">
                <template v-slot:prepend>
                  <q-icon name="vpn_key"/>
                </template>
                <template v-slot:after>
                  <q-btn
                      @click="handleChooseFile('keyPath', [
                    {name: '所有文件', extensions: ['*']},
                    {name: '密钥文件', extensions: ['key']},
                  ])"

                      outline icon="attachment"/>
                </template>
              </q-input>
            </q-card-section>

            <q-card-actions class="q-px-lg">
              <q-btn
                  type="submit"
                  unelevated size="lg" color="secondary" class="full-width text-white" label="Unlock"/>
            </q-card-actions>
          </q-form>

          <q-card-section class="text-center q-pa-sm">
            <p class="text-grey-6">
              可信任的离线日记本 <br>
              © {{ new Date().getFullYear() }} {{ pkg.name }} {{ pkg.version }} by {{ pkg.author }}
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      form: {
        dbPath: '',
        keyPath: '',
        password: '',
      }
    }
  },
  computed: {
    pkg() {
      return this.$store.getters.pkg
    }
  },
  methods: {
    /**
     * 选择文件
     * name：对应表单name
     * filters：文件过滤器，[{name: 'KeePass KDBX 文件', extensions: ['kdbx']}]
     **/
    handleChooseFile(name, filters) {
      const results = window.electronAPI.openFileChooser(filters)
      // console.log(results)
      if (results && results[0]) {
        this.form[name] = results[0]
      }
    },
    handleUnlock() {
      const {dbPath, password, keyPath} = this.form
      if (!dbPath) {
        this.errorToast('数据库路径不能为空')
        return
      }
      if (!password && !keyPath) {
        this.errorToast('密码或密钥路径不能为空')
        return
      }
      alert('OK!')
    },
    errorToast(msg) {
      this.$q.notify({
        message: msg,
        color: 'negative',
        position: 'top',
        timeout: 500
      })
    }
  }
}
</script>

<style>
</style>
