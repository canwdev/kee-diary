<template>
  <div>
    <TkModalDialog
      v-model="mVisible"
      show-close
    >
      <TkCard padding="none" class="card-add-entry">
        <form class="settings-form" @submit.prevent="handleSubmit">
          <div class="settings-title">
            {{ isAddGroup ? $t('home.create-group') : $t('home.create-entry') }}
          </div>

          <div class="settings-content">
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

            <template v-if="!isAddGroup">
              <div class="settings-row">
                <div class="s-label">{{ $t('choose-icon') }}: </div>
                <div class="s-actions">
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

              <div class="settings-row">
                <div class="s-label">{{ $t('color') }}: </div>

                <div class="s-actions flex items-center">
                  <div class="color-icon">
                    <ColorItem
                      :color="form.fgColor"
                      @click.native="showColorChooser(true)"
                    />
                    <div class="color-title">{{ $t('foreground') }}</div>
                  </div>

                  <div class="color-icon">
                    <ColorItem
                      :color="form.bgColor"
                      @click.native="showColorChooser(false)"
                    />
                    <div class="color-title">{{ $t('background') }}</div>
                  </div>
                </div>
              </div>
            </template>

          </div>

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
import {mapState} from 'vuex'
import {createEntry, createGroup} from '@/api'
import ItemIcon from '@/components/ItemIcon.vue'
import ColorItem from './ColorItem.vue'
import DialogChooseIcon from '@/components/DialogChooseIcon.vue'
import DialogChooseGroup from '@/components/DialogChooseGroup.vue'
import DialogChooseColor from '@/components/DialogChooseColor.vue'

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
    ...mapState([
      'selectedGroup'
    ]),
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
.card-add-entry {

  .color-icon {
    margin-left: 20px;
    text-align: center;
    .color-title {
      font-size: 12px;
      margin-top: 2px;
    }
  }
}
</style>

