<template>
  <div class="CreateProject">
    <h2> Add New Digital Health Project </h2>
    <p>
      Please complete the following information before beginning the self-assessment process.
      These questions may be used as a baseline document recording the current features of your project and your goals for the process of scaling up.
    </p>
    <project-form />
  </div>
</template>

<script>
import ProjectForm from '../../../components/project/ProjectForm';

export default {
  components: {
    ProjectForm
  },
  fetc ({store}) {
    store.dispatch('project/resetProjectState');
  }
};
</script>

<style lang="less">
.CreateProject {
}
</style>
