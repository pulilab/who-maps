<template>
  <div class="Project">
    <project-bar />
    <nuxt-child />
  </div>
</template>

<script>
import ProjectBar from '../../../components/common/ProjectBar';

export default {
  components: {
    ProjectBar
  },
  async fetch ({ store, params }) {
    await store.dispatch('projects/setCurrentProject', params.id);
    await Promise.all([
      store.dispatch('project/loadProject', params.id),
      store.dispatch('projects/loadProjectStructure')
    ]);
  }
};
</script>

<style>

</style>
