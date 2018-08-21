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
  }
};
</script>

<style>

</style>
