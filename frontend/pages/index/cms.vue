<template>

  <div id="cmsjs"/>
</template>

<script>

export default {
  components: {
  },

  middleware: ['isLoggedIn'],

  mounted () {
    const cmsFactory = require('../../angular/Cms/cmsFactory');
    cmsFactory.cmsFactory();
  }
};
</script>

<style>

</style>
