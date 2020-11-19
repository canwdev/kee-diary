<template>
  <q-card class="check-connection q-pa-md">
    <div class="text-h6">Internet Connection
      <q-btn flat color="secondary" no-caps @click="check">Check</q-btn>
    </div>

    <ul>
      <li title="window.navigator.onLine">System:
        <Status :type="status.navigator"/>
      </li>
      <li title="Electron BrowserWindow">Frontend:
        <Status :type="status.frontend"/>
      </li>
      <li title="Electron Node.js">Backend:
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
        console.log(data)
      }).catch(() => {
        this.status.frontend = ConnectType.OFFLINE
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.check-connection {
  text-align: left;

  ul {
    padding 0 20px

    li {
      display flex
      justify-content space-between
    }
  }
}
</style>
