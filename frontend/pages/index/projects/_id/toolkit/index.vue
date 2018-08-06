<template>
  <div id="toolkitjs"/>
</template>

<script>

export default {
  components: {
  },
  mounted () {
    const mapsToolkitFactory = require('../../../../../angular/MapsToolkit/mapsToolkitFactory');
    mapsToolkitFactory.factory();
  }
};
</script>

<style>

</style>
