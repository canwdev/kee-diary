<template>
  <q-dialog
      v-model="mVisible"
      transition-show="fade"
      transition-hide="fade"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6 row items-center">
          <IconShow
              :item="{icon:index}"
          />
          <span class="q-ml-md">Choose Icon</span>
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-section style="max-height: 70vh" class="scroll">
        <q-card flat class="q-gutter-md">
          <q-btn
              v-for="(item, i) in icons"
              :key="i"
              @click="selectedIndex = i"
              :flat="i !== selectedIndex"
              color="primary"
              round
          >
            <IconShow
                :item="{icon:i}"
            />
            <q-tooltip>
              {{ item.name }}
            </q-tooltip>
          </q-btn>
        </q-card>
      </q-card-section>

      <q-separator/>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup/>
        <q-btn
            :disabled="index === selectedIndex"
            @click="handleChoose"
            flat label="Choose" color="primary" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import icons from '@/assets/db-icons'
import IconShow from "./IconShow"

export default {
  components: {
    IconShow
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: null
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
  watch: {
    index: {
      handler(nv) {
        this.selectedIndex = nv
      },
      immediate: true
    }
  },
  data() {
    return {
      icons: Object.freeze(icons.list),
      selectedIndex: null
    }
  },
  methods: {
    handleChoose() {
      this.$emit('onChoose', this.selectedIndex)
    }
  }
}
</script>
