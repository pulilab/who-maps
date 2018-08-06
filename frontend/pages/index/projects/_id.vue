<template>
  <div class="Project">
    <nuxt-child />
  </div>
</template>

<script>
export default {
  async fetch ({ store, params }) {
    await Promise.all([
      store.dispatch('projects/setCurrentProject', params.id),
      store.dispatch('projects/loadProjectStructure'),
      store.dispatch('toolkit/loadToolkitData')
    ]);
  }
};
</script>

<style>

</style>
