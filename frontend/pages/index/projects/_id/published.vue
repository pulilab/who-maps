<template>
  <div class="ProjectPublishedView">
    <div class="PageTitle">
      <h2>Edit Project Info</h2>
      <p>
        You are viewing the
        <span class="DrafBit">
          Published
        </span>
        version of the project.
      </p>
    </div>
    <project-data />
  </div>
</template>

<script>
import ProjectData from '../../../../components/project/ProjectData';
export default {
  components: {
    ProjectData
  },
  async fetch ({store, params}) {
    await store.dispatch('project/loadProject', params.id);
  }
};
</script>

<style>

</style>
