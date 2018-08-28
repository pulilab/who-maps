<template>
  <div>
    <nuxt-child />
  </div>
</template>

<script>
// NOTE: This is only a router view wrapper, for common fetches
export default {
  async fetch ({ store }) {
    await Promise.all([
      store.dispatch('system/loadStaticData'),
      store.dispatch('countries/loadMapData'),
      store.dispatch('landing/loadPublicProjectList')
    ]);
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
