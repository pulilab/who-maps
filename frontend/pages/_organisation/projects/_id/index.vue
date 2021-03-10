<template>
  <project-layout type="draft">
    <template #title>
      <translate>View Project Info</translate>
    </template>
    <template #subtitle>
      <translate>You are viewing the</translate>
      <tag type="draft" label="draft" />
      <translate>version of the project.</translate>
    </template>
    <project-data show-draft />
  </project-layout>
</template>

<script>
import { fetchProjectData } from "@/utilities/projects";
import ProjectData from "@/components/project/ProjectData";
import ProjectLayout from "@/components/project/wrappers/ProjectLayout";
import Tag from "@/components/common/Tag";

export default {
  middleware: ["isLoggedIn"],
  components: {
    ProjectData,
    ProjectLayout,
    Tag,
  },
  fetch({ store, params, error }) {
    return fetchProjectData(store, params, error);
  },
};
</script>
