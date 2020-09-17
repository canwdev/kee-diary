<template>
  <q-page class="flex items-center justify-center bg-wall">
    <div class="text-center">
      <h5 class="text-primary">About</h5>

      <q-card class="text-white q-pa-md q-mb-lg bg-wood">
        <div>Trusted offline diary</div>
        <div>Comes with absolutely no warranty</div>
      </q-card>

      <div class="column q-gutter-sm">
        <q-btn color="primary" to="/home">Home</q-btn>
        <q-btn color="primary" @click="logDatabase">Log database</q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "About",
  methods: {
    logDatabase() {
      const db = this.$store.getters.database
      console.log(db)
    }
  }
}
</script>
