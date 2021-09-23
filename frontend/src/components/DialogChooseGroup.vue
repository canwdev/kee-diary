<template>
  <TkModalDialog
    v-model="mVisible"
    show-close
  >
    <TkCard class="card-choose-group">
      <div class="flex items-center">
        <span>{{ $t('choose-group') }}</span>
      </div>

      <hr/>

      <div v-if="mVisible" class="card-tree">
        <p v-if="showTips" class="text-weight-thin">{{ $t('tip') }}: {{
          $t('kdbx.do-not-move-to-the-group-itself')
        }}</p>
        <GroupTree
          :selected.sync="selected"
        />
      </div>

      <hr/>

      <div class="action-btn-row" >

        <TkButton flat :label="$t('cancel')"  @click="mVisible = false"/>
        <TkButton
          :disabled="!selected"
          :label="$t('choose')"
          @click="handleChoose"
        />
      </div>
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

<style lang="scss" scoped>
.card-choose-group {
  min-width: 400px;

  .card-tree {
    max-height: 70vh;
    overflow: auto;
  }

}
</style>

