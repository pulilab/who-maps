<template>
  <div class="AdminImportPage">
    <import-prototype />
  </div>
</template>

<script>
import ImportPrototype from '@/components/admin/import/ImportPrototype';
export default {

  components: {
    ImportPrototype
  },
  async fetch ({ store }) {
    await Promise.all([
      store.dispatch('system/loadUserProfiles'),
      store.dispatch('system/loadDonors'),
      store.dispatch('projects/loadProjectStructure'),
      store.dispatch('system/loadStaticData'),
      store.dispatch('system/loadOrganisations'),
      store.dispatch('countries/loadMapData'),
      store.dispatch('admin/import/loadQueue')
    ]);
  }
};
</script>

<style>

</style>
