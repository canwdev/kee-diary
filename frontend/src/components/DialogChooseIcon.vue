<template>
  <q-dialog v-model="mVisible">
    <q-card>
      <q-card-section>
        <div class="text-h6 row items-center">
          <q-avatar size="32px" square>
            <img :src="icons[index]"/>
          </q-avatar>
          <span class="q-ml-md">Choose Icon</span>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 600px" class="scroll q-gutter-md">
        <q-btn
            v-for="(item, i) in icons"
            :key="i"
            @click="selectedIndex = i"
            :flat="i !== selectedIndex"
            color="primary"
            round
        >
          <q-avatar size="32px" square>
            <img :src="item"/>
          </q-avatar>
          <q-tooltip>
            {{ iconNames[i] }}
          </q-tooltip>
        </q-btn>
      </q-card-section>

      <q-separator/>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup/>
        <q-btn
            @click="handleChoose"
            flat label="Choose" color="primary" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import icons, {formatIconName} from '@/assets/db-icons'

export default {
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
      icons: Object.freeze(icons.items),
      iconNames: icons.items.map(formatIconName),
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
