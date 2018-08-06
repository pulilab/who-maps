<template>
  <div class="ProjectsArea">
    <nuxt-child />
  </div>
</template>

<script>
export default {
  components: {
  },
  middleware: ['isLoggedIn'],
  async fetch ({store}) {
    await store.dispatch('projects/loadUserProjects');
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .ProjectsArea {
  }
</style>
