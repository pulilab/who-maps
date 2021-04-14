<template>
  <project-layout>
    <template #title>
      <translate>Register your Digital Health Project</translate>
    </template>
    <template #subtitle>
      <translate>
        Please complete the questions below to include your project information
        in the Digital Health Atlas. These questions document your project's
        health focus area(s), software features and national scale.
      </translate>
    </template>
    <project-form />
  </project-layout>
</template>

<script>
import ProjectForm from '@/components/project/ProjectForm'
import ProjectLayout from '@/components/project/wrappers/ProjectLayout'
export default {
  components: {
    ProjectForm,
    ProjectLayout
  },
  middleware: ['isLoggedIn'],
  async fetch ({ store }) {
    await Promise.all([
      store.dispatch('project/resetProjectState'),
      store.dispatch('projects/loadProjectStructure'),
      store.dispatch('system/loadDonors'),
      store.dispatch('system/loadStaticData')
    ])
  }
}
</script>
