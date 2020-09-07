<template>
  <a class="cursor-pointer">
    {{ mDate }}
    <q-popup-edit v-model="mDate" buttons  :cover="false" :offset="[0, 5]">
      <q-input dense filled v-model="mDate">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy>
              <q-date v-model="mDate" mask="YYYY-MM-DD HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
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
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </q-popup-edit>
  </a>
</template>

<script>
import {formatDate} from "../utils"

export default {
  name: "DateTimeEdit",
  props: {
    date: [String, Date],
    default() {
      return formatDate(new Date())
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

<style scoped>

</style>
