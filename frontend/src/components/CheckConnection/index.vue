<template>
  <q-card class="check-connection q-py-md q-px-lg">
    <div class="text-h6 flex items-center justify-between">Internet Connection
      <q-btn dense flat color="secondary" no-caps @click="check">Check</q-btn>
    </div>

    <ul>
      <li title="window.navigator.onLine">System:
        <Status :type="status.navigator"/>
      </li>
      <li title="Electron BrowserWindow fetch: v1.hitokoto.cn">Frontend:
        <Status :type="status.frontend"/>
      </li>
      <li title="Electron Node.js fetch: developers.google.cn">Backend:
        <Status :type="status.backend"/>
      </li>
    </ul>
  </q-card>
</template>

<script>
import {ConnectType} from './enum'
import Status from './Status'

const initStatus = Object.freeze({
  navigator: ConnectType.CHECKING,
  frontend: ConnectType.CHECKING,
  backend: ConnectType.CHECKING
})

export default {
  name: "CheckConnection",
  components: {Status},
  data() {
    return {
      status: {...initStatus}
    }
  },
  created() {
    this.check()
  },
  methods: {
    check() {
      this.status = {...initStatus}

      this.status.navigator = window.navigator.onLine ? ConnectType.ONLINE : ConnectType.OFFLINE

      window.electronAPI.checkIsOnLine().then(flag => {
        this.status.backend = flag ? ConnectType.ONLINE : ConnectType.OFFLINE
      })

      fetch('https://v1.hitokoto.cn/').then(res => {
        this.status.frontend = ConnectType.ONLINE
        return res.json()
      }).then(data => {
        if (data && data.hitokoto) {
          this.$emit('onMessage', data.hitokoto)
        }
      }).catch(() => {
        this.status.frontend = ConnectType.OFFLINE
        this.$emit('onMessage', null)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.check-connection {
  text-align: left;

  ul {
    padding 0

    li {
      display flex
      justify-content space-between
    }
  }
}
</style>
