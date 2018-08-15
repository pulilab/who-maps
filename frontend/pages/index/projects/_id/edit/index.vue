<template>
  <div class="EditProject">
    <div class="PageTitle">
      <h2>Edit Project Info</h2>
      <p>
        You are viewing the
        <span class="DrafBit">
          Draft
        </span>
        version of the project.
      </p>
    </div>
    <project-form />
  </div>
</template>

<script>
import ProjectForm from '../../../../../components/project/ProjectForm';

export default {
  components: {
    ProjectForm
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .EditProject {

  }
</style>
