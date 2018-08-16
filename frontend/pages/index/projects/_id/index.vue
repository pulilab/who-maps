<template>
  <div class="ProjectDraftView">
    <div class="PageTitle">
      <h2>View Project Info</h2>
      <p>
        You are viewing the
        <span class="DraftLabel">
          Draft
        </span>
        version of the project.
      </p>
    </div>
    <project-data draft />>
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
