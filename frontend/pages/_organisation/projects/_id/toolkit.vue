<template>
  <div class="Toolkit" >
    <nuxt-child />
  </div>
</template>

<script>

export default {
  components: {
  },
  middleware: ['isLoggedIn'],
  async fetch ({store}) {
    store.dispatch('landing/resetSearch');
    await store.dispatch('projects/loadUserProjects');
    await store.dispatch('toolkit/loadToolkitData');
  }
};
</script>

<style>

</style>
