<template>
  <page-layout>
    <template #title>
      <translate>My Projects</translate>
    </template>
    <template #subtitle>
      <translate>Here are all of the projects you are a</translate>
      <fa
        icon="star"
        class="owner"
      />
      <b><translate>Member</translate></b>
      &nbsp;<translate>or</translate>
      <fa
        icon="eye"
        class="viewer"
      />
      <b><translate>Viewer</translate></b>
      &nbsp;<translate>of.</translate>
    </template>
    <user-project-list />
  </page-layout>
</template>

<script>
import UserProjectList from '@/components/common/UserProjectsList'
import PageLayout from '@/components/common/wrappers/PageLayout'
export default {
  name: 'Projects',
  components: {
    UserProjectList,
    PageLayout
  },
  middleware: ['isLoggedIn'],
  async fetch ({ store }) {
    await store.dispatch('projects/loadUserProjects')
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";
.svg-inline--fa {
  margin: 0 6px 0 10px;
  width: 16px;
  height: 16px;
}
.owner {
  color: @colorOwner;
}
.viewer {
  color: @colorViewer;
}
</style>
