<template>
  <TkModalDialog
    v-model="mVisible"
  >
    <TkCard style="width: 420px">
      <form @submit.prevent="handleSearch">

        <TkCard>
          <div class="text-h6 row items-center">
            <div class="text-h6 row items-center">
              <span class="q-ml-sm">搜索</span>
            </div>

            <TkButton icon="close" @click="mVisible = false"/>
          </div>
        </TkCard>

        <hr/>

        <TkCard class="form-wrap  q-gutter-md">
          <div class="form-row">
            <div class="row-title q-mb-xs">要搜索的群组:</div>
            <div class="row-content flex-1">
              <TkButton
                outline
                class="list-btn"
                @click="isDialogChooseGroupVisible = true"
              >
                <ItemIcon
                  :item="{icon: groupInfo.iconIndex}"
                />
                {{ groupInfo.name }}
              </TkButton>
            </div>
          </div>

          <div class="form-row">
            <div class="row-title q-mb-xs">搜索标题、内容 *</div>
            <div class="row-content">
              <TkInput v-model="searchText" outlined autofocus/>
            </div>
          </div>

        </TkCard>

        <hr/>

        <TkCard class="q-px-md">
          <TkSwitch
            v-model="isDeep"
            size="sm"
          >搜索子群组
          </TkSwitch>

          <TkButton
            label="清除"

            @click="clearSearch"
          />
          <TkButton
            :disable="!searchText"
            label="搜索"
            type="submit"

          />
        </TkCard>
      </form>

      <hr/>

      <div v-if="!searchResults.length" class="text-center ">
        无搜索结果
      </div>
      <div v-else class="result-list ">
        <TkButton
          v-for="item in searchResults"
          :key="item.uuid.id"
          class="list-btn"
          :style="{
            background: item.bgColor,
            color: item.fgColor
          }"
          @click="handlePreview(item)"
        >
          <ItemIcon
            :item="{iconIndex: item.icon}"
            size="16px"
            :icon-scale="1"
          />
          <span class="entry-title q-ml-sm">{{ item.fields.Title }}</span>
        </TkButton>
      </div>

      <TkLoading :visible="isLoading">
      </TkLoading>

    </TkCard>

    <DialogChooseGroup
      :visible.sync="isDialogChooseGroupVisible"
      @onChoose="getGroupInfo"
    />

  </TkModalDialog>
</template>

<script>
import store from '@/store'
import DialogChooseGroup from '@/components/DialogChooseGroup.vue'
import ItemIcon from '@/components/ItemIcon.vue'
// import {searchEntries} from '@/utils/kdbx-utils'

export default {
  name: 'DialogSearch',
  components: {
    DialogChooseGroup,
    ItemIcon
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      groupInfo: {
        iconIndex: 0,
        name: '',
        groupUuid: null
      },
      isDialogChooseGroupVisible: false,
      isDialogPreviewVisible: false,
      searchText: '',
      isDeep: true,
      searchResults: [],
      isLoading: false,
      currentEntry: null
    }
  },
  computed: {
    mVisible: {
      get() {
        return this.visible
      },
      set(nv) {
        this.$emit('update:visible', nv)
      }
    },
    selectedGroup: {
      get: () => store.state.selectedGroup,
    },
    database: {
      get: () => store.getters.database
    },
  },
  watch: {
    mVisible: {
      handler(nv) {
        if (nv) {
          this.getGroupInfo(this.selectedGroup)
        }
      },
      immediate: true
    }
  },
  methods: {
    getGroupInfo(groupUuid) {
      const group = this.database.getGroup(groupUuid)
      this.groupInfo.name = group.name
      this.groupInfo.iconIndex = group.icon
      this.groupInfo.groupUuid = groupUuid
    },
    handleSearch() {
      if (!this.searchText || this.isLoading) {
        return
      }
      try {
        this.isLoading = true
        // this.searchResults = searchEntries(
        //   this.database,
        //   this.groupInfo.groupUuid,
        //   this.searchText,
        //   this.isDeep
        // )
        // console.log('this.searchResults', this.searchResults)
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    clearSearch() {
      this.searchText = ''
      this.searchResults = []
    },
    handlePreview(entry) {
      this.currentEntry = entry
      this.isDialogPreviewVisible = true
    },
  }
}
</script>

<style lang="scss" scoped>
.flex-1 {
  flex: 1;
}

.list-btn {
  width: 100%;

  ::v-deep .TkButton__content {
    justify-content: flex-start !important;
  }
}

.result-list {
  max-height: 300px;
  overflow: auto;
}
</style>
