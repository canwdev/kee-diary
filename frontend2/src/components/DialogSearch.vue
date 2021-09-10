<template>
  <TkModalDialog
    v-model="mVisible"
  >
    <TkCard style="width: 420px">
      <form @submit.prevent="handleSearch">

        <TkCard-section>
          <div class="text-h6 row items-center">
            <div class="text-h6 row items-center">
              <q-icon name="search"/>
              <span class="q-ml-sm">搜索</span>
            </div>
            <q-space/>
            <TkButton v-close-popup icon="close" flat round dense/>
          </div>
        </TkCard-section>

        <q-separator/>

        <TkCard-section class="form-wrap q-pa-md q-gutter-md">
          <div class="form-row">
            <div class="row-title q-mb-xs">要搜索的群组:</div>
            <div class="row-content flex-1">
              <TkButton
                outline
                class="list-btn"
                @click="isDialogChooseGroupVisible = true"
              >
                <IconShow
                  :item="{icon: groupInfo.iconIndex}"
                />
                {{ groupInfo.name }}
              </TkButton>
            </div>
          </div>

          <div class="form-row">
            <div class="row-title q-mb-xs">搜索标题、内容 *</div>
            <div class="row-content">
              <q-input v-model="searchText" outlined autofocus/>
            </div>
          </div>

        </TkCard-section>

        <q-separator/>

        <TkCard-actions class="q-px-md">
          <q-toggle
            v-model="isDeep"
            size="sm"
            label="搜索子群组"
          />
          <q-space/>
          <TkButton
            flat
            label="清除"
            color="primary"
            @click="clearSearch"
          />
          <TkButton
            :disable="!searchText"
            label="搜索"
            type="submit"
            color="primary"
          />
        </TkCard-actions>
      </form>

      <q-separator/>

      <div v-if="!searchResults.length" class="text-center q-pa-md">
        无搜索结果
      </div>
      <div v-else class="result-list q-pa-md">
        <TkButton
          v-for="item in searchResults"
          :key="item.uuid.id"
          flat
          class="list-btn"
          :style="{
            background: item.bgColor,
            color: item.fgColor
          }"
          @click="handlePreview(item)"
        >
          <IconShow
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

    <DialogPreviewEntry
      :visible.sync="isDialogPreviewVisible"
      :entry="currentEntry"
    />

    <DialogChooseGroup
      :visible.sync="isDialogChooseGroupVisible"
      @onChoose="getGroupInfo"
    />

  </TkModalDialog>
</template>

<script>
import store from '@/store'
import DialogPreviewEntry from '@/components/DialogPreviewEntry'
import DialogChooseGroup from '@/components/DialogChooseGroup'
import IconShow from '@/components/IconShow'
import {searchEntries} from '@/utils/kdbx-utils'

export default {
  name: 'DialogSearch',
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
