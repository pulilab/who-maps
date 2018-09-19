<template>
  <div class="ProjectsArea">
    <nuxt-child />
  </div>
</template>

<script>
export default {
  components: {
  },
  async fetch ({store}) {
    await Promise.all([
      store.dispatch('projects/loadUserProjects'),
      store.dispatch('projects/loadProjectStructure')

    ]);
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .ProjectsArea {
    margin-bottom: 60px;

    .UserProjectsList {
      .limitPageWidth();
    }
  }
</style>
