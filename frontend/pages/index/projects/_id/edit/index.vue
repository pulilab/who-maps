<template>
  <div class="EditProject">
    <div class="PageTitle">
      <h2>Edit Project Info</h2>
      <p>
        You are viewing the
        <span class="DraftLabel">
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
  },
  async fetch ({store, params}) {
    await store.dispatch('project/loadProject', params.id);
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .EditProject {
    .DraftLabel {
      display: inline-block;
      height: 24px;
      margin: 0 2px;
      padding: 0 10px;
      font-size: @fontSizeSmall;
      font-weight: 700;
      line-height: 24px;
      text-transform: uppercase;
      border-radius: 12px;
      background-color: @colorDraft;
      color: @colorTextPrimary;
    }
  }
</style>
