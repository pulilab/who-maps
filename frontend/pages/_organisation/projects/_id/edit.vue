<template>
  <PageLayout type="draft">
    <template #title>
      <translate>Edit Project Info</translate>
    </template>
    <template #subtitle>
      <translate>You are viewing the</translate>
      <ProjectStatusBadge status="draft" />
      <translate>version of the project.</translate>
    </template>
    <ProjectForm draft />
  </PageLayout>
</template>

<script>
import { fetchProjectData } from '@/utilities/projects'
import ProjectForm from '@/components/project/ProjectForm'
import PageLayout from '@/components/common/wrappers/PageLayout'
import ProjectStatusBadge from '@/components/project/ProjectStatusBadge'
export default {
  name: 'Edit',
  components: {
    ProjectForm,
    PageLayout,
    ProjectStatusBadge
  },
  middleware: ['authGuard'],
  fetch ({ store, params, error }) {
    return fetchProjectData(store, params, error)
  }
}
</script>
