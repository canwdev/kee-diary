<template>
  <TkLoading v-if="type === ConnectType.CHECKING" class="status-item">
  </TkLoading>
  <span v-else-if="type === ConnectType.ONLINE" class="status-item online"> Online</span>
  <span v-else-if="type === ConnectType.OFFLINE" class="status-item offline"> Offline</span>
  <span v-else class="status-item unknown"> Unknown</span>
</template>

<script>
import {ConnectType} from './enum'

export default {
  name: 'Status',
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

<style lang="scss" scoped>
.status-item {
  &.online {
    color: green;
  }

  &.offline {
    color: gray;
  }

  &.unknown {
    color: sandybrown;
  }
}
</style>
