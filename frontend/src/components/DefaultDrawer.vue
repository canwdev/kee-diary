<template>
  <q-drawer
      v-model="mValue"
      bordered
      overlay
      behavior="mobile"
  >
    <q-scroll-area class="fit">
      <q-list>
        <q-item-label header>Navigation</q-item-label>

        <template v-if="isUnlocked">
          <q-item clickable tag="a" to="/home">
            <q-item-section avatar>
              <q-icon name="home"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Home</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-else>
          <q-item clickable tag="a" to="/login">
            <q-item-section avatar>
              <q-icon name="login"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Login</q-item-label>
            </q-item-section>
          </q-item>
        </template>


        <q-item clickable tag="a" to="/about">
          <q-item-section avatar>
            <q-icon name="info"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>About</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator/>
        <q-item-label header>Settings</q-item-label>

        <q-item clickable @click="isDarkMode = !isDarkMode">
          <q-item-section avatar>
            <q-icon name="nights_stay"/>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              Dark mode
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-toggle v-model="isDarkMode"/>
          </q-item-section>
        </q-item>

      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import store from "@/store"

export default {
  name: "DefaultDrawer",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    mValue: {
      get() {
        return this.value
      },
      set(nv) {
        return this.$emit('input', nv)
      }
    },
    isDarkMode: {
      get: () => store.getters.isDarkMode,
      set: val => store.commit('setIsDarkMode', val)
    },
    isUnlocked: {
      get: () => store.getters.isUnlocked
    }
  },
  watch: {
    isDarkMode: {
      handler(nv) {
        this.$q.dark.set(nv)
      },
      immediate: true
    }
  },
  methods: {
    toggleFullscreen() {
    }
  }
}
</script>

<style scoped>

</style>
