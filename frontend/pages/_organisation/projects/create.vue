<template>
  <div class="CreateProject">
    <div class="PageTitle">
      <h2><translate>Add New Digital Health Project</translate></h2>
      <p>
        <translate>Please complete the following information before beginning the self-assessment process. These questions may be used as a baseline document recording the current features of your project and your goals for the process of scaling up.</translate>
      </p>
    </div>
    <project-form />
  </div>
</template>

<script>
import ProjectForm from '../../../components/project/ProjectForm';

export default {
  components: {
    ProjectForm
  },
  fetch ({store}) {
    store.dispatch('project/resetProjectState');
  }
};
</script>

<style lang="less">
  @import "../../../assets/style/variables.less";
  @import "../../../assets/style/mixins.less";

  .CreateProject {}
</style>
