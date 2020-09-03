<template>
  <q-page
      class="row justify-center items-center"
  >
    <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-10" style="width:400px;">
          <q-card-section class="bg-primary text-center">
            <q-avatar size="64px" color="white">
              <q-icon name="lock" color="primary"/>
            </q-avatar>

            <h4 class="text-h5 text-white q-my-sm">打开 KDBX 数据库</h4>
          </q-card-section>
          <q-card-section>
            <q-form class="q-px-sm q-gutter-y-sm q-pt-md">
              <q-input outlined dense clearable v-model="email" type="text" placeholder="数据库文件">
                <template v-slot:prepend>
                  <q-icon name="lock"/>
                </template>
                <template v-slot:after>
                  <q-btn outline icon="attachment"/>
                </template>
              </q-input>
              <q-input outlined dense clearable v-model="password" type="password" placeholder="Password">
                <template v-slot:prepend>
                  <q-icon name="vpn_key"/>
                </template>
              </q-input>
              <q-input outlined dense clearable v-model="password" type="text" placeholder="密钥文件">
                <template v-slot:prepend>
                  <q-icon name="vpn_key"/>
                </template>
                <template v-slot:after>
                  <q-btn outline icon="attachment"/>
                </template>
              </q-input>
            </q-form>
          </q-card-section>

          <q-card-actions class="q-px-lg">
            <q-btn unelevated size="lg" color="secondary" class="full-width text-white" label="Unlock"/>
          </q-card-actions>
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
      email: '',
      username: '',
      password: '',
    }
  },
  computed: {
    pkg() {
      return this.$store.getters.pkg
    }
  }
}
</script>

<style>
</style>
