<template>
  <div class="Project">
    <nuxt-child />
  </div>
</template>

<script>
export default {
  async fetch ({ store, params }) {
    await store.dispatch('projects/setCurrentProject', params.id);
    await Promise.all([
      store.dispatch('projects/loadProjectStructure'),
      store.dispatch('toolkit/loadToolkitData')
    ]);
  }
};
</script>

<style>

</style>
