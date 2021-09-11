<template>
  <a :class="{'cursor-pointer': !disabled}">{{ mDate }}
    <q-popup-edit v-if="!disabled" v-model="mDate" buttons :cover="false" :offset="[0, 5]">
      <TkInput v-model="mDate" filled>
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy>
              <q-date v-model="mDate" mask="YYYY-MM-DD HH:mm">
                <div class="row items-center justify-end">
                  <TkButton v-close-popup label="Close" color="primary" flat/>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy>
              <q-time v-model="mDate" mask="YYYY-MM-DD HH:mm" format24h>
                <div class="row items-center justify-end">
                  <TkButton v-close-popup label="Close" color="primary" flat/>
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </TkInput>
    </q-popup-edit>
  </a>
</template>

<script>
import {formatDate} from '@/utils'

export default {
  name: 'DateTimeEdit',
  props: {
    date: {
      type: [String, Date],
      default() {
        return formatDate(new Date())
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    mDate: {
      get() {
        const d = this.date
        if (typeof d !== 'string') {
          return formatDate(d)
        }
        return d
      },
      set(nv) {
        this.$emit('update:date', new Date(nv))
      }
    }
  },
  methods: {
    formatDate
  }
}
</script>

<style lang="scss" scoped>
.cursor-pointer {
  &:hover {
    text-decoration: underline;
  }
}
</style>
