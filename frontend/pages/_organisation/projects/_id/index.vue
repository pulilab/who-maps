<template>
  <div class="ProjectDraftView">
    <div class="PageTitle">
      <h2><translate>View Project Info</translate></h2>
      <p>
        <translate>You are viewing the
          <span class="DraftLabel">
            Draft
          </span>
          version of the project.</translate>
      </p>
    </div>
    <project-data show-draft />
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

<style lang="less">
  @import "../../../../assets/style/variables.less";
  @import "../../../../assets/style/mixins.less";

</style>
