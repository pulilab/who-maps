<template>
  <page-layout>
    <template #title>
      <translate>View Project Info</translate>
    </template>
    <template #subtitle>
      <translate>You are viewing the</translate>
      <tag
        type="publish"
        label="published"
      />
      <translate>version of the project.</translate>
    </template>
    <project-data published />
  </page-layout>
</template>

<script>
import { fetchProjectData } from '@/utilities/projects'
import ProjectData from '@/components/project/ProjectData'
import PageLayout from '@/components/common/wrappers/PageLayout'
import Tag from '@/components/common/Tag'
export default {
  components: {
    ProjectData,
    PageLayout,
    Tag
  },
  async fetch ({ store, params, error }) {
    await fetchProjectData(store, params, error)
  }
}
</script>

<style lang="less">
@import '~assets/style/variables.less';
@import '~assets/style/mixins.less';
</style>
