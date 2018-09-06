<template>
  <div class="Toolkit" >
    <nuxt-child />
  </div>
</template>

<script>

export default {
  components: {
  },
  async fetch ({store}) {
    await store.dispatch('projects/loadUserProjects');
    await store.dispatch('toolkit/loadToolkitData');
  }
};
</script>

<style>

</style>
