<template>

  <div id="toolkitjs"/>
</template>

<script>

export default {
  components: {
  },
  async fetch ({store}) {
    await store.dispatch('projects/loadUserProjects');
  },
  mounted () {
    const mapsToolkitFactory = require('../../../../angular/MapsToolkit/mapsToolkitFactory');
    mapsToolkitFactory.factory();
  }
};
</script>

<style>

</style>
