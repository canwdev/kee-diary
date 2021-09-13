<template>
  <TkModalDialog
    v-model="mVisible"
  >
    <TkCard style="min-width: 400px">
      <TkCard>
        <div class="text-h6 row items-center">
          <span>{{ $t('choose-group') }}</span>
        </div>
      </TkCard>

      <hr/>

      <TkCard style="max-height: 70vh" class="scroll">
        <TkCard v-if="mVisible" flat class="q-gutter-md">
          <p v-if="showTips" class="text-weight-thin">{{ $t('tip') }}: {{
              $t('kdbx.do-not-move-to-the-group-itself')
            }}</p>
          <GroupTree
            :selected-group-uuid.sync="selected"
          />
        </TkCard>
      </TkCard>

      <hr/>

      <TkCard>
        <TkButton @click="mVisible = false" flat :label="$t('cancel')" color="primary"/>
        <TkButton
          :disabled="!selected"
          flat
          :label="$t('choose')"
          color="primary"
          @click="handleChoose"
        />
      </TkCard>
    </TkCard>
  </TkModalDialog>
</template>

<script>
import GroupTree from '@/components/GroupTree'

export default {
  name: 'DialogChooseGroup',
  components: {
    GroupTree
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    showTips: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected: null
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
    }
  },
  methods: {
    handleChoose() {
      this.$emit('onChoose', this.selected)
    }
  }
}
</script>

