<template>
  <q-page class="flex items-center justify-center">
    <div class="text-center">
      <h3>About</h3>

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
