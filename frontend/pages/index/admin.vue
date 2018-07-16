<template>
  <div>
    <router-view />
  </div>
</template>

<script>
// NOTE: This is only a router view wrapper, for common fetches
import { mapGetters } from 'vuex';

export default {
  components: {
  },
  middleware: ['isLoggedIn'],
  computed: {
    ...mapGetters({
    })
  },
  async fetch ({ store }) {}
};
</script>

<style lang="sass">
</style>
