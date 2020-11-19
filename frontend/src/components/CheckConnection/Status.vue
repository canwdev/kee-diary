<template>
  <span class="status-item" v-if="type === ConnectType.CHECKING">
    <q-spinner-ios />
  </span>
  <span class="status-item online" v-else-if="type === ConnectType.ONLINE"><q-icon name="public"/> Online</span>
  <span class="status-item offline" v-else-if="type === ConnectType.OFFLINE"><q-icon name="public_off"/> Offline</span>
  <span class="status-item unknown" v-else><q-icon name="help"/> Unknown</span>
</template>

<script>
import {ConnectType} from "./enum"

export default {
  name: "Status",
  props: {
    type: {
      type: String,
      default: ConnectType.CHECKING
    }
  },
  data() {
    return {
      ConnectType
    }
  }
}
</script>

<style lang="stylus" scoped>
.status-item {
  &.online {
    color $red
  }
  &.offline {
    color $green
  }
  &.unknown {
    color $yellow
  }
}
</style>
