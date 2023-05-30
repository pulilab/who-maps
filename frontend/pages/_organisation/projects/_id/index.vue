<template>
  <page-layout type="draft">
    <template #title>
      <translate>View Project Info</translate>
    </template>
    <template #subtitle>
      <translate>You are viewing the</translate>
      <ProjectStatusBadge status="draft" />
      <translate>version of the project.</translate>
    </template>
    <project-data />
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
  middleware: ['authGuard'],
  fetch ({ store, params, error }) {
    return fetchProjectData(store, params, error)
  }
}
</script>
