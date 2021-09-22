<template>
  <TkModalDialog
    v-model="mVisible"
    show-close
  >
    <TkCard style="width: 320px">
      <form @submit.prevent="handleSubmit">
        <div>
          {{ $t('home.add-entry') }}
        </div>

        <hr/>

        <div class="form-wrap">
          <div class="form-row">
            <div class="row-title">{{ $t('choose-group') }}:</div>
            <div class="row-content">
              <TkButton
                outline
                style="width: 100%;"
                @click="isShowChooseGroup = true"
              >
                <ItemIcon
                  :item="{icon: groupInfo.iconIndex}"
                />
                {{ groupInfo.name }}
              </TkButton>
            </div>
          </div>

          <div class="form-row">
            <div class="row-title q-mb-xs">{{ $t('home.title') }}:</div>
            <div class="row-content">
              <TkInput
                v-model="form.title"
                required
                dense
                outlined
                autofocus
              />
            </div>
          </div>

          <div class="form-row flex justify-between">
            <div class="text-center">
              <div class="row-title q-mb-xs">{{ $t('choose-icon') }}</div>
              <div class="row-content">
                <TkButton
                  flat
                  round
                  @click="isShowChooseIcon = true"
                >
                  <ItemIcon
                    size="45px"
                    :item="form"
                  />
                </TkButton>
              </div>
            </div>

            <div class="text-center">
              <div class="row-title q-mb-xs">{{ $t('foreground') + ' ' + $t('color') }}</div>
              <div class="row-content">
                <ColorItem
                  :color="form.fgColor"
                  @click.native="showColorChooser(true)"
                />
              </div>
            </div>

            <div class="text-center">
              <div class="row-title q-mb-xs">{{ $t('background') + ' ' + $t('color') }}</div>
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

        <div align="right">
          <TkButton
            flat
            :label="$t('cancel')"
            color="primary"
            @click="mVisible = false"
          />
          <TkButton
            :disable="!form.title"
            flat
            :label="$t('confirm')"
            type="submit"
            color="primary"
            @click="mVisible = false"
          />
        </div>
      </form>
    </TkCard>

    <DialogChooseIcon
      :visible.sync="isShowChooseIcon"
      :index="form.iconIndex"
      @onChoose="handleUpdateIcon"
    />
    <DialogChooseGroup
      :visible.sync="isShowChooseGroup"
      @onChoose="handleChooseGroup"
    />
    <DialogChooseColor
      ref="colorChooser"
      :item="form"
      :visible.sync="isShowChooseColor"
      @onChoose="handleUpdateColor"
    />

  </TkModalDialog>
</template>

<script>
import store from '@/store'

import ItemIcon from '@/components/ItemIcon'
import ColorItem from './ColorItem'
import DialogChooseIcon from '@/components/DialogChooseIcon'
import DialogChooseGroup from '@/components/DialogChooseGroup'
import DialogChooseColor from '@/components/DialogChooseColor'

const initForm = Object.freeze({
  groupUuid: null,
  title: '',
  iconIndex: 0,
  bgColor: null,
  fgColor: null
})
export default {
  name: 'DialogAddEntry',
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
    }
  },
  data() {
    return {
      groupInfo: {
        iconIndex: 0,
        name: '',
      },
      isShowChooseIcon: false,
      isShowChooseGroup: false,
      isShowChooseColor: false,
      form: {...initForm}
    }
  },
  computed: {
    currentGroupUuid: {
      get: () => store.getters.currentGroupUuid,
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
    }
  },
  watch: {
    mVisible: {
      handler(nv) {
        if (nv) {
          this.form.title = new Date().toLocaleString()
          this.getGroupInfo(this.currentGroupUuid)
        }
      },
      immediate: true
    }
  },
  methods: {
    getGroupInfo(groupUuid) {
      // const group = this.database.getGroup(groupUuid)
      // this.groupInfo.name = group.name
      // this.groupInfo.iconIndex = group.icon
      // this.form.iconIndex = group.icon
      // this.form.groupUuid = groupUuid
    },
    handleUpdateIcon(iconIndex) {
      this.form.iconIndex = iconIndex
    },
    handleChooseGroup(groupUuid) {
      this.getGroupInfo(groupUuid)
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
    handleSubmit() {
      if (!this.form.title) {
        return
      }
      this.$emit('confirm', this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-wrap {
  .form-row {
    & + .form-row {
      margin-top: 10px;
    }
  }
}
</style>

