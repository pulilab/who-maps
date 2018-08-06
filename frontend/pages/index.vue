<template>
  <div>
    <nuxt-child />
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
      store.dispatch('countries/loadMapData'),
      store.dispatch('landing/loadPublicProjectList')
      // store.dispatch('system/loadUserProfiles')
    ]);
    if (store.getters['user/getProfile']) {
      await Promise.all([
        store.dispatch('projects/loadUserProjects'),
        store.dispatch('system/loadOrganisations')
      ]);
    }
  }
};
</script>

<style lang="sass">
</style>
