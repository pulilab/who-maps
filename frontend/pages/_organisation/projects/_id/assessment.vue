<template>
  <div class="angularjs">
    <div id="assessmentjs"/>
  </div>
</template>

<script>

export default {
  components: {
  },
  middleware: ['isLoggedIn'],
  async fetch ({store, params}) {
    await store.dispatch('projects/setCurrentProject', params.id);
    await Promise.all([
      store.dispatch('project/loadProject', params.id),
      store.dispatch('projects/loadProjectStructure'),
      store.dispatch('toolkit/loadToolkitData')
    ]);
    const project = store.getters['projects/getCurrentProject'];
    const country = project.published && project.published.country ? project.published.country : project.draft.country;
    await store.dispatch('countries/loadMapData');
    await store.dispatch('countries/loadGeoJSON', country);
  },
  mounted () {
    const assesmentFactory = require('../../../../angular/Assessment/assessmentFactory');
    assesmentFactory.assesmentFactory();
  }
};
</script>

<style>

</style>
