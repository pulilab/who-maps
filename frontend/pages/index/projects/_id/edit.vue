<template>
  <div class="ProjectEdit">
    <nuxt-child />
  </div>
</template>

<script>
export default {
  async fetch ({store, params}) {
    await store.dispatch('project/loadProject', params.id);
  }
};
</script>

<style>

</style>
