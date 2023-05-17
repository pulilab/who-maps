<template>
  <page-layout>
    <template #title>
      <translate>View Project Info</translate>
    </template>
    <template #subtitle>
      <translate>You are viewing the</translate>
      <ProjectStatusBadge status="published" />
      <translate>version of the project.</translate>
    </template>
    <project-data published />
  </page-layout>
</template>

<script>
import { fetchProjectData } from '@/utilities/projects'
import ProjectData from '@/components/project/ProjectData'
import PageLayout from '@/components/common/wrappers/PageLayout'
import ProjectStatusBadge from '@/components/project/ProjectStatusBadge'
export default {
  components: {
    ProjectData,
    PageLayout,
    ProjectStatusBadge
  },
  async fetch ({ store, params, error }) {
    await fetchProjectData(store, params, error)
    if (
      !store.state.project.published ||
      store.state.project.published.name === null
    ) {
      error({
        statusCode: 404,
        message: 'Project is not published'
      })
    }
  }
}
</script>

<style lang="less">
@import '~assets/style/variables.less';
@import '~assets/style/mixins.less';
</style>
