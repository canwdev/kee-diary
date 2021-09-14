<template>
  <TkCard solid class="check-connection">
    <div class="flex items-center justify-between"><b>Internet Connection</b>
      <TkButton flat color="secondary" no-caps @click="check">Check</TkButton>
    </div>

    <ul>
      <li><abbr title="window.navigator.onLine">System</abbr>
        <Status :type="status.navigator"/>
      </li>
      <li><abbr title="Electron BrowserWindow test: v1.hitokoto.cn">Render</abbr>
        <Status :type="status.frontend"/>
      </li>
      <li><abbr title="Electron Node.js test: developers.google.cn">Electron</abbr>
        <Status :type="status.backend"/>
      </li>
    </ul>
  </TkCard>
</template>

<script>
import {ConnectType} from './enum'
import Status from './Status'
import axios from 'axios'

const getInitStatus = (initState = ConnectType.UNKNOWN) => {
  return {
    navigator: initState,
    frontend: initState,
    backend: initState
  }
}

export default {
  name: 'CheckConnection',
  components: {Status},
  data() {
    return {
      status: getInitStatus()
    }
  },
  created() {
    // this.check()
  },
  methods: {
    check() {
      this.status = getInitStatus(ConnectType.CHECKING)

      this.status.navigator = window.navigator.onLine ? ConnectType.ONLINE : ConnectType.OFFLINE

      window.electronAPI.checkConnectivity().then(flag => {
        this.status.backend = flag ? ConnectType.ONLINE : ConnectType.OFFLINE
      })

      axios.get('https://v1.hitokoto.cn/', {
        timeout: 5000,
        params: {
          c: ['k', 'i', 'c']
        }
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

<style lang="scss" scoped>
.check-connection {
  text-align: left;

  ul {
    padding: 0;

    li {
      display: flex;
      justify-content: space-between;
      line-height: 2;
    }
  }
}
</style>
