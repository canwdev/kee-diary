<template>
  <q-dialog
      v-model="mVisible"
      transition-show="fade"
      transition-hide="fade"
  >
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6 row items-center">
          <span>{{$t('choose-group')}}</span>
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-section style="max-height: 70vh" class="scroll">
        <q-card flat class="q-gutter-md" v-if="mVisible">
          <p v-if="showTips" class="text-weight-thin">{{$t('tip')}}: {{$t('kdbx.do-not-move-to-the-group-itself')}}</p>
          <GroupTree
              :selectedGroupUuid.sync="selected"
          />
        </q-card>
      </q-card-section>

      <q-separator/>

      <q-card-actions align="right">
        <q-btn flat :label="$t('cancel')" color="primary" v-close-popup/>
        <q-btn
            :disabled="!selected"
            @click="handleChoose"
            flat :label="$t('choose')" color="primary" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import GroupTree from "@/views/Home/GroupTree"

export default {
  name: "DialogChooseGroup",
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

<style scoped>

</style>
