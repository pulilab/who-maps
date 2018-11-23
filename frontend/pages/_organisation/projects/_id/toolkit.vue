<template>
  <div class="Toolkit" >
    <nuxt-child />
  </div>
</template>

<script>
import { fetchProjectData } from '@/utilities/projects';
export default {
  components: {
  },
  middleware: ['isLoggedIn'],
  async fetch ({store, params, error}) {
    store.dispatch('landing/resetSearch');
    await fetchProjectData(store, params, error);
    await store.dispatch('projects/loadUserProjects');
    await store.dispatch('toolkit/loadToolkitData');
  }
};
</script>

<style>

</style>
