<template>
  <div class="angularjs">
    <div id="cmsjs"/>
  </div>
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
