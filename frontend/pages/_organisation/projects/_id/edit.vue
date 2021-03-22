<template>
  <project-layout type="draft">
    <template #title>
      <translate>Edit Project Info</translate>
    </template>
    <template #subtitle>
      <translate>You are viewing the</translate>
      <tag type="draft" label="draft" />
      <translate>version of the project.</translate>
    </template>
    <project-form draft />
  </project-layout>
</template>

<script>
import { fetchProjectData } from "@/utilities/projects";
import ProjectForm from "@/components/project/ProjectForm";
import ProjectLayout from "@/components/project/wrappers/ProjectLayout";
import Tag from "@/components/common/Tag";
export default {
  middleware: ["isLoggedIn"],
  components: {
    ProjectForm,
    ProjectLayout,
    Tag,
  },
  fetch({ store, params, error }) {
    return fetchProjectData(store, params, error);
  },
};
</script>
