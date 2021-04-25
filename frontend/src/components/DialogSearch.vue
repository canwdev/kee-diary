<template>
  <q-dialog
      v-model="mVisible"
      transition-show="fade"
      transition-hide="fade"
  >
    <q-card style="width: 420px">
      <form @submit.prevent="handleSearch">

        <q-card-section>
          <div class="text-h6 row items-center">
            <div class="text-h6 row items-center">
              <q-icon name="search"/>
              <span class="q-ml-sm">搜索</span>
            </div>
            <q-space/>
            <q-btn icon="close" flat round dense v-close-popup/>
          </div>
        </q-card-section>

        <q-separator/>

        <q-card-section class="form-wrap q-pa-md q-gutter-md">
          <div class="form-row">
            <div class="row-title q-mb-xs">要搜索的群组:</div>
            <div class="row-content flex-1">
              <q-btn
                  @click="isDialogChooseGroupVisible = true"
                  outline
                  class="list-btn"
              >
                <IconShow
                    :item="{icon: groupInfo.iconIndex}"
                />
                {{ groupInfo.name }}
              </q-btn>
            </div>
          </div>

          <div class="form-row">
            <div class="row-title q-mb-xs">搜索标题、内容 *</div>
            <div class="row-content">
              <q-input dense outlined v-model="searchText" autofocus/>
            </div>
          </div>

        </q-card-section>

        <q-separator/>

        <q-card-actions class="q-px-md">
          <q-toggle
              size="sm"
              v-model="isDeep"
              label="搜索子群组"
          />
          <q-space/>
          <q-btn
              flat
              label="清除"
              color="primary"
              @click="clearSearch"
          />
          <q-btn
              :disable="!searchText"
              label="搜索"
              type="submit"
              color="primary"
          />
        </q-card-actions>
      </form>

      <q-separator/>

      <div v-if="!searchResults.length" class="text-center q-pa-md">
        无搜索结果
      </div>
      <div v-else class="result-list q-pa-md">
        <q-btn
            flat
            v-for="item in searchResults"
            :key="item.uuid.id"
            class="list-btn"
            @click="handlePreview(item)"
            :style="{
                      background: item.bgColor,
                      color: item.fgColor
                    }"
        >
          <IconShow
              :item="{iconIndex: item.icon}"
              size="16px"
              :icon-scale="1"
          />
          <span class="entry-title q-ml-sm">{{ item.fields.Title }}</span>
        </q-btn>
      </div>

      <q-inner-loading :showing="isLoading">
        <q-spinner-gears size="50px" color="primary"/>
      </q-inner-loading>

    </q-card>

    <DialogPreviewEntry
        :visible.sync="isDialogPreviewVisible"
        :entry="currentEntry"
    />

    <DialogChooseGroup
        :visible.sync="isDialogChooseGroupVisible"
        @onChoose="getGroupInfo"
    />

  </q-dialog>
</template>

<script>
import store from "@/store"
import DialogPreviewEntry from "@/components/DialogPreviewEntry"
import DialogChooseGroup from "@/components/DialogChooseGroup"
import IconShow from "@/components/IconShow"
import {searchEntries} from "@/utils/kdbx-utils"

export default {
  name: "DialogSearch",
  components: {
    DialogChooseGroup,
    DialogPreviewEntry,
    IconShow
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
    currentGroupUuid: {
      get: () => store.getters.currentGroupUuid,
    },
    database: {
      get: () => store.getters.database
    },
  },
  watch: {
    mVisible: {
      handler(nv) {
        if (nv) {
          this.getGroupInfo(this.currentGroupUuid)
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
        this.searchResults = searchEntries(
            this.database,
            this.groupInfo.groupUuid,
            this.searchText,
            this.isDeep
        )
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

<style lang="stylus" scoped>
.flex-1 {
  flex 1
}

.list-btn {
  width: 100%

  >>> .q-btn__content {
    justify-content flex-start !important
  }
}

.result-list {
  max-height 300px
  overflow: auto;
}
</style>
