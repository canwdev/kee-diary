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
        <div
          v-for="item in entryList"
          :key="item.uuid"
          class="relative-position table-row _check"
        >
          <div class="t-col _icon">
            <ItemIcon
              class="cursor-pointer"
              :item="item"
              @click.native.stop="previewItem(item)"
            />
          </div>
          <div class="t-col _title">{{ item.title }}</div>
          <div class="t-col _time">{{ formatDateLite(item.creationTime) }}</div>
          <div class="t-col _time">{{ formatDateLite(item.lastModTime) }}</div>
        </div>

        <TkEmpty v-if="!(entryList && entryList.length)"></TkEmpty>
      </div>


    </div>
  </div>
</template>

<script>
import {formatDateLite} from '@/utils'
import store from '@/store'
import ItemIcon from '@/components/ItemIcon'
import {getGroupEntries} from "@/api"
import mainBus, {BUS_SHOW_PREVIEW} from "@/utils/bus"

export default {
  name: 'EntryList',
  components: {
    ItemIcon
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
      selected: [],
      previewTarget: {},
    }
  },
  computed: {
    pagination: {
      get: () => store.getters.currentEntryPagination,
      set: val => store.commit('setCurrentEntryPagination', val)
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
    formatDateLite,
    async loadEntryList() {
      if (!(this.selectedGroup && this.selectedGroup.data)) {
        return
      }
      const {data} = this.selectedGroup
      if (!data) {
        return
      }
      this.entryList = await getGroupEntries(data.uuid) || []
    },
    previewItem(item) {
      mainBus.$emit(BUS_SHOW_PREVIEW, item)

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

  }
}

</style>
