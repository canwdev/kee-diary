<template>
  <div>
    <TkModalDialog
      v-model="mVisible"
      show-close
    >
      <TkCard class="card-add-entry">
        <form @submit.prevent="handleSubmit">
          <div>
            {{ isAddGroup ? $t('home.create-group') : $t('home.create-entry') }}
          </div>

          <hr/>

          <div class="form-wrap">
            <div class="form-row">
              <div class="row-title">{{ $t('choose-group') }}:</div>
              <div class="row-content">
                <TkButton
                  type="button"
                  theme="outline"
                  class="full-width flex items-center"
                  @click="isShowChooseGroup = true"
                >
                  <ItemIcon
                    :item="{icon: groupInfo.icon}"
                  />
                  <span class="text-overflow">{{ groupInfo.name }}</span>
                </TkButton>
              </div>
            </div>

            <div class="form-row">
              <div class="row-title ">{{ $t('home.title') }}:</div>
              <div class="row-content">
                <TkInput
                  v-model="form.title"
                  required
                  class="full-width"
                  autofocus
                  size="lg"
                />
              </div>
            </div>

            <div v-if="!isAddGroup" class="form-row flex justify-between">
              <div class="choose-btn-wrap">
                <div class="row-title ">{{ $t('choose-icon') }}</div>
                <div class="row-content">
                  <TkButton
                    type="button"
                    size="no-style"
                    @click="isShowChooseIcon = true"
                  >
                    <ItemIcon
                      size="45px"
                      :item="form"
                    />
                  </TkButton>
                </div>
              </div>

              <div class="choose-btn-wrap">
                <div class="row-title ">{{ $t('foreground') + ' ' + $t('color') }}</div>
                <div class="row-content">
                  <ColorItem
                    :color="form.fgColor"
                    @click.native="showColorChooser(true)"
                  />
                </div>
              </div>

              <div class="choose-btn-wrap">
                <div class="row-title ">{{ $t('background') + ' ' + $t('color') }}</div>
                <div class="row-content">
                  <ColorItem
                    :color="form.bgColor"
                    @click.native="showColorChooser(false)"
                  />
                </div>
              </div>
            </div>

          </div>

          <hr/>

          <div class="action-btn-row">
            <TkButton
              type="button"
              :label="$t('cancel')"
              @click="mVisible = false"
            />
            <TkButton
              :disable="!form.title"
              type="submit"
              :label="$t('confirm')"
            />
          </div>
        </form>
      </TkCard>
    </TkModalDialog>

    <template v-if="mVisible">
      <DialogChooseIcon
        :visible.sync="isShowChooseIcon"
        :index="form.icon"
        @onChoose="handleUpdateIcon"
      />
      <DialogChooseGroup
        :visible.sync="isShowChooseGroup"
        :auto-expand-uuid="autoExpandUuid"
        @onChoose="handleChooseGroup"
      />
      <DialogChooseColor
        ref="colorChooser"
        :item="form"
        :visible.sync="isShowChooseColor"
        @onChoose="handleUpdateColor"
      />
    </template>

  </div>

</template>

<script>
import store from '@/store'
import {createEntry, createGroup} from '@/api'
import ItemIcon from '@/components/ItemIcon'
import ColorItem from './ColorItem'
import DialogChooseIcon from '@/components/DialogChooseIcon'
import DialogChooseGroup from '@/components/DialogChooseGroup'
import DialogChooseColor from '@/components/DialogChooseColor'

const initForm = Object.freeze({
  groupUuid: null,
  title: '',
  icon: 0,
  bgColor: null,
  fgColor: null
})
export default {
  name: 'DialogAdd',
  components: {
    ItemIcon,
    ColorItem,
    DialogChooseIcon,
    DialogChooseGroup,
    DialogChooseColor
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isAddGroup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      groupInfo: {
        icon: 0,
        name: '',
        groupItem: null,
      },
      isShowChooseIcon: false,
      isShowChooseGroup: false,
      isShowChooseColor: false,
      form: {...initForm}
    }
  },
  computed: {
    selectedGroup: {
      get: () => store.state.selectedGroup,
    },
    database: {
      get: () => store.getters.database
    },
    mVisible: {
      get() {
        return this.visible
      },
      set(nv) {
        this.$emit('update:visible', nv)
      }
    },
    autoExpandUuid() {
      const item = this.groupInfo.groupItem
      if (item) {
        return item.data.uuid
      }
      return null
    }
  },
  watch: {
    mVisible: {
      handler(nv) {
        if (nv) {
          this.form.title = new Date().toLocaleString()
          this.setGroupInfo(this.selectedGroup)
        }
      },
      immediate: true
    }
  },
  methods: {
    setGroupInfo(item) {
      const {data} = item
      this.groupInfo.name = item.title
      this.groupInfo.icon = data.icon
      this.groupInfo.groupItem = item
      this.form.icon = data.icon
      this.form.groupUuid = data.uuid
    },
    handleUpdateIcon(icon) {
      this.form.icon = icon
    },
    handleChooseGroup(group) {
      this.setGroupInfo(group)
      this.isShowChooseGroup = false
    },
    handleUpdateColor(result) {
      console.log(result)
      const {type, value} = result
      this.form[type] = value
    },
    showColorChooser(isFgColor) {
      this.$refs.colorChooser.isFgColor = isFgColor
      this.isShowChooseColor = true
    },
    async handleSubmit() {
      if (!this.form.title) {
        return
      }

      if (this.isAddGroup) {
        await this.doCreateGroup()
      } else {
        await this.doCreateEntry()
      }
    },
    async doCreateEntry() {
      try {
        this.$store.commit('setIsGlobalLoading', true)
        const entry = await createEntry({
          groupUuid: this.form.groupUuid,
          config: this.form
        })

        this.$store.commit('setIsChanged', true)
        this.mVisible = false
        this.$emit('addEntrySuccess', {
          form: this.form,
          entry,
          group: this.groupInfo.groupItem
        })
      } catch (e) {
        console.error(e)
        this.$toast.error({message: e})
      } finally {
        this.$store.commit('setIsGlobalLoading', false)
      }
    },
    async doCreateGroup() {
      try {
        this.$store.commit('setIsGlobalLoading', true)
        const group = await createGroup({
          groupUuid: this.form.groupUuid,
          name: this.form.title
        })

        this.$store.commit('setIsChanged', true)
        this.mVisible = false
        this.$emit('addGroupSuccess', group)
      } catch (e) {
        console.error(e)
        this.$toast.error({message: e})
      } finally {
        this.$store.commit('setIsGlobalLoading', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-wrap {
  .form-row {
    & + .form-row {
      margin-top: 15px;
    }

    .row-title {
      margin-bottom: 5px;
    }
  }
}

.card-add-entry {
  width: 400px;

  .choose-btn-wrap {
    text-align: center;
    padding: 10px;


  }
}
</style>

