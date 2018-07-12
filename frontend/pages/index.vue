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
  computed: {
    ...mapGetters({
    })
  },
  async fetch ({ store }) {
    await Promise.all([
      store.dispatch('system/loadStaticData'),
      store.dispatch('landing/loadMapData'),
      store.dispatch('landing/loadPublicProjectList')
      // store.dispatch('system/loadUserProfiles')
    ]);
  }
};
</script>

<style lang="sass">
</style>
