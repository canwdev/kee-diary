<template>
  <q-card class="check-connection q-py-md q-px-lg">
    <div class="text-h6 flex items-center justify-between"><abbr title="(Offline for better security)">Internet Connection</abbr>
      <q-btn dense flat color="secondary" no-caps @click="check">Check</q-btn>
    </div>

    <ul>
      <li><abbr title="window.navigator.onLine">System</abbr>
        <Status :type="status.navigator"/>
      </li>
      <q-separator/>
      <li><abbr title="Electron BrowserWindow test: v1.hitokoto.cn">Frontend</abbr>
        <Status :type="status.frontend"/>
      </li>
      <q-separator/>
      <li><abbr title="Electron Node.js test: developers.google.cn">Backend</abbr>
        <Status :type="status.backend"/>
      </li>
    </ul>
  </q-card>
</template>

<script>
import {ConnectType} from './enum'
import Status from './Status'
import axios from 'axios'

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

      axios.get('https://v1.hitokoto.cn/', {
        timeout: 10000,
      }).then(({data}) => {
        this.status.frontend = ConnectType.ONLINE
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
      line-height: 2
    }
  }
}
</style>
