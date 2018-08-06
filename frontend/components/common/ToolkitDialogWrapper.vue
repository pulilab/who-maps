<template>
  <div id="thematicjs"/>
</template>

<script>
export default {
  mounted () {
    const factory = require('../../angular/Thematic/thematicFactory');
    factory.factory(0, 0, 'MAPS Toolkit', 'md-primary', 'Toolkit');
  }
};
</script>

<style>

</style>
