<template>
  <span class="status-item" v-if="type === ConnectType.CHECKING">
    <q-spinner-ios />
  </span>
  <span class="status-item online" v-else-if="type === ConnectType.ONLINE">Online</span>
  <span class="status-item offline" v-else-if="type === ConnectType.OFFLINE">Offline</span>
  <span class="status-item unknown" v-else>Unknown</span>
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
    color $positive
  }
  &.offline {
    color $negative
  }
  &.unknown {
    color $warning
  }
}
</style>
