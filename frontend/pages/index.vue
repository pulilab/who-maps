<template>
  <div class="">
    Main component
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {
  },
  computed: {
    ...mapGetters({
    })
  },
  async fetch ({ store }) {
    await Promise.all([
      store.dispatch('system/loadStaticData')
      // store.dispatch('system/loadUserProfiles')
    ]);
  }
};
</script>

<style lang="sass">
</style>
