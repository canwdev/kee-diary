<template>
  <q-dialog
      v-model="mVisible"
      transition-show="fade"
      transition-hide="fade"
  >
    <q-card style="width: 320px">
      <q-card-section>
        <div class="text-h6 row items-center">
          <q-icon name="add"/> <span class="q-ml-sm">{{ $t('home.add-entry') }}</span>
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-section class="form-wrap q-pa-md q-gutter-md">
        <div class="form-row">
          <div class="row-title q-mb-xs">{{ $t('choose-group') }}:</div>
          <div class="row-content">
            <q-btn
                @click="isDialogChooseGroupVisible = true"
                outline
                style="width: 100%;"
            >
              <IconShow
                  :item="{icon: groupInfo.iconIndex}"
              />
              {{ groupInfo.name }}
            </q-btn>
          </div>
        </div>

        <div class="form-row">
          <div class="row-title q-mb-xs">{{ $t('home.title') }}:</div>
          <div class="row-content">
            <q-input dense outlined v-model="form.title"/>
          </div>
        </div>

        <div class="flex justify-between">
          <div class="form-row text-center">
            <div class="row-title q-mb-xs">{{ $t('choose-icon') }}</div>
            <div class="row-content">
              <q-btn
                  flat
                  round
                  @click="isDialogChooseIconVisible = true"
              >
                <IconShow
                    size="45px"
                    :item="form"
                />
              </q-btn>
            </div>
          </div>

          <div class="form-row text-center">
            <div class="row-title q-mb-xs">{{ $t('foreground') + ' ' + $t('color') }}</div>
            <div class="row-content">
              <ColorItem
                  @click.native="showColorChooser(true)"
                  :color="form.fgColor"
              />
            </div>
          </div>

          <div class="form-row text-center">
            <div class="row-title q-mb-xs">{{ $t('background') + ' ' + $t('color') }}</div>
            <div class="row-content">
              <ColorItem
                  @click.native="showColorChooser(false)"
                  :color="form.bgColor"
              />
            </div>
          </div>
        </div>

      </q-card-section>

      <q-separator/>

      <q-card-actions align="right">
        <q-btn
            flat
            :label="$t('cancel')"
            color="primary"
            v-close-popup
        />
        <q-btn
            flat
            :label="$t('confirm')"
            @click="$emit('confirm', form)"
            color="primary"
            v-close-popup
        />
      </q-card-actions>
    </q-card>

    <DialogChooseIcon
        :visible.sync="isDialogChooseIconVisible"
        :index="form.iconIndex"
        @onChoose="handleUpdateIcon"
    />
    <DialogChooseGroup
        :visible.sync="isDialogChooseGroupVisible"
        @onChoose="handleChooseGroup"
    />
    <DialogChooseColor
        ref="colorChooser"
        :item="form"
        :visible.sync="isDialogChooseColorVisible"
        @onChoose="handleUpdateColor"
    />

  </q-dialog>
</template>

<script>
import store from "@/store"

import IconShow from "@/components/IconShow"
import ColorItem from "./ColorItem"
import DialogChooseIcon from "@/components/DialogChooseIcon"
import DialogChooseGroup from "@/components/DialogChooseGroup"
import DialogChooseColor from "@/components/DialogChooseColor"

const initForm = Object.freeze({
  groupUuid: null,
  title: '',
  iconIndex: 0,
  bgColor: null,
  fgColor: null
})
export default {
  name: "DialogAddEntry",
  components: {
    IconShow,
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
      isDialogChooseIconVisible: false,
      isDialogChooseGroupVisible: false,
      isDialogChooseColorVisible: false,
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
      this.form.groupUuid = groupUuid
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
      this.isDialogChooseColorVisible = true
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
