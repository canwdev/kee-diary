<template>
  <div class="entry-list-view">

    <div class="entry-table">
      <div class="table-head">
        <div class="t-col _icon">★</div>
        <div class="t-col _title">{{ $t('home.title') }}</div>
        <div class="t-col _time">{{ $t('home.created') }}</div>
        <div class="t-col _time">{{ $t('home.modified') }}</div>
      </div>

      <div class="table-body">
        <ListItem
            v-for="item in pagedList"
            :key="item.uuid"
            :item="item"
            @preview="previewItem"
            @itemClick="handleItemClick"
            @itemContextMenu="handleContextMenu"
        />

        <TkPager
            v-show="pagerOptions.allCount && pagerOptions.allCount > pagerOptions.pageSize"
            :page-size="pagerOptions.pageSize"
            :offset.sync="pagerOptions.offset"
            :total="pagerOptions.allCount"
            show-extra-info
        />

        <TkEmpty v-if="!(entryList && entryList.length)"></TkEmpty>
      </div>

      <ContextMenuCommon
          ref="ctxMenu"
      />

    </div>
  </div>
</template>

<script>
import ListItem from './ListItem.vue'
import {getGroupEntries} from '@/api'
import mainBus, {BUS_SHOW_PREVIEW} from '@/utils/bus'
import {getNodeUuid} from '@/api'
import ContextMenuCommon from '@/components/ContextMenuCommon.vue'

export default {
  name: 'EntryList',
  components: {
    ListItem,
    ContextMenuCommon
  },
  props: {
    selectedGroup: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      entryList: [],
      selected: []
    }
  },
  computed: {
    pagerOptions: {
      get() {
        return this.$store.state.pagerOptions
      },
      set(val) {
        this.$store.commit('setPagerOptions', val)
      }
    },
    pagedList() {
      const {
        offset,
        pageSize
      } = this.pagerOptions
      const start = (offset) * pageSize
      return this.entryList.slice(start, start + pageSize)
    }
  },
  watch: {
    selectedGroup: {
      handler() {
        this.loadEntryList()
      },
      immediate: true
    }
  },
  methods: {
    async loadEntryList() {
      try {
        const uuid = getNodeUuid(this.selectedGroup)
        if (!uuid) {
          this.entryList = []
          return
        }
        // console.log('gg', this.selectedGroup)
        this.entryList = await getGroupEntries(uuid) || []
        this.pagerOptions.offset = 0
        this.pagerOptions.allCount = this.entryList.length
      } catch (e) {
        console.error(e)
        this.$toast.error({message: e})
      }
    },
    previewItem(item) {
      mainBus.$emit(BUS_SHOW_PREVIEW, item)
    },
    handleItemClick(item) {
      this.$router.push({
        name: 'Detail',
        params: {
          uuid: item.uuid
        }
      })
    },
    handleContextMenu(item) {
      this.$refs.ctxMenu.open(item)
    }
  }
}
</script>

<style lang="scss" scoped>

.entry-list-view {
  height: 100%;
}

.entry-table {
  width: 100%;
  height: 100%;
  flex: 1;
  opacity: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;

  .table-head {
    height: 50px;
    opacity: 1;
    border-radius: 4px 4px 0px 0px;
    flex-wrap: nowrap;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: $layout-border;
  }

  .table-body {
    flex: 1;
    overflow: auto;
    overflow-y: overlay; // 滚动条覆盖
    padding: 0 20px;

    ::v-deep .table-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      border-bottom: $layout-border;
      cursor: pointer;

      &:hover {
        background: $border-color;
      }
    }
  }

  ::v-deep .t-col {
    &._icon {
      width: 50px;
      text-align: center;
    }

    &._title {
      flex: 1;
      padding: 0 30px;
      box-sizing: border-box;
    }

    &._time {
      width: 150px;
    }

    @media screen and (max-width: $mq_tablet_width) {
      &._time {
        display: none;
      }
    }

  }
}

</style>
