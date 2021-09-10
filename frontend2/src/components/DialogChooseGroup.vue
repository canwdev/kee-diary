<template>
  <TkModalDialog
    v-model="mVisible"
  >
    <TkCard style="min-width: 400px">
      <TkCard-section>
        <div class="text-h6 row items-center">
          <span>{{ $t('choose-group') }}</span>
        </div>
      </TkCard-section>

      <q-separator/>

      <TkCard-section style="max-height: 70vh" class="scroll">
        <TkCard v-if="mVisible" flat class="q-gutter-md">
          <p v-if="showTips" class="text-weight-thin">{{ $t('tip') }}: {{ $t('kdbx.do-not-move-to-the-group-itself') }}</p>
          <GroupTree
            :selected-group-uuid.sync="selected"
          />
        </TkCard>
      </TkCard-section>

      <q-separator/>

      <TkCard-actions align="right">
        <TkButton v-close-popup flat :label="$t('cancel')" color="primary"/>
        <TkButton
          v-close-popup
          :disabled="!selected"
          flat
          :label="$t('choose')"
          color="primary"
          @click="handleChoose"
        />
      </TkCard-actions>
    </TkCard>
  </TkModalDialog>
</template>

<script>
import GroupTree from '@/views/Home/GroupTree'

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

