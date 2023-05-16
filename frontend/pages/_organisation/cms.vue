<template>
  <div class="angularjs">
    <div id="cmsjs" />
  </div>
</template>

<script>
export default {
  components: {
  },
  middleware: ['authGuard'],
  fetch ({ store }) {
    store.dispatch('landing/resetSearch')
  },
  watch: {
    '$route.query.q': function (q) {
      if (q) {
        window.location.reload(true)
      }
    }
  },
  mounted () {
    const cmsFactory = require('../../angular/Cms/cmsFactory')
    cmsFactory.cmsFactory()
  }
}
</script>

<style>

</style>
