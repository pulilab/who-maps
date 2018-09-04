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
      userProfile: 'user/getProfile'
    })
  },
  watch: {
    userProfile: {
      immediate: true,
      handler (profile) {
        if (this.$raven) {
          this.$raven.setUserContext(profile);
        }
      }
    }
  },
  async fetch ({ store, params }) {
    await Promise.all([
      store.dispatch('system/loadStaticData'),
      store.dispatch('system/loadDonors'),
      store.dispatch('countries/loadMapData'),
      store.dispatch('landing/loadProjects')
    ]);
    if (params.organisation !== 'who') {
      await store.dispatch('landing/loadCountryData', params.organisation);
    } else {
      store.dispatch('landing/clearCountryData');
    }
    if (store.getters['user/getProfile']) {
      await Promise.all([
        store.dispatch('projects/loadUserProjects'),
        store.dispatch('system/loadOrganisations'),
        store.dispatch('system/loadUserProfiles')
      ]);
    }
  }
};
</script>

<style lang="sass">
</style>
