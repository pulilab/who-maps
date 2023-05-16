<template>
  <page-layout type="draft">
    <template #title>
      <translate>Edit Project Info</translate>
    </template>
    <template #subtitle>
      <translate>You are viewing the</translate>
      <tag
        type="draft"
        label="draft"
      />
      <translate>version of the project.</translate>
    </template>
    <project-form draft />
  </page-layout>
</template>

<script>
import { fetchProjectData } from '@/utilities/projects'
import ProjectForm from '@/components/project/ProjectForm'
import PageLayout from '@/components/common/wrappers/PageLayout'
import Tag from '@/components/common/Tag'
export default {
  components: {
    ProjectForm,
    PageLayout,
    Tag
  },
  middleware: ['authGuard'],
  fetch ({ store, params, error }) {
    return fetchProjectData(store, params, error)
  }
}
</script>
