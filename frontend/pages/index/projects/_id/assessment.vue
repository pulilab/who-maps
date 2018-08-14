<template>
  <div class="angularjs">
    <div id="assessmentjs"/>
  </div>
</template>

<script>

export default {
  components: {
  },
  async fetch ({store}) {
    await store.dispatch('projects/loadUserProjects');
    const project = store.getters['projects/getCurrentProject'];
    await store.dispatch('countries/loadGeoJSON', project.published.country);
  },
  mounted () {
    const assesmentFactory = require('../../../../angular/Assessment/assessmentFactory');
    assesmentFactory.assesmentFactory();
  }
};
</script>

<style>

</style>
