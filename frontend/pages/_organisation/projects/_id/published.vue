<template>
  <project-layout>
    <template #title>
      <translate>View Project Info</translate>
    </template>
    <template #subtitle>
      <translate>You are viewing the</translate>
      <tag type="publish" label="published" />
      <translate>version of the project.</translate>
    </template>
    <project-data published />
  </project-layout>
</template>

<script>
import { fetchProjectData } from "@/utilities/projects";
import ProjectData from "@/components/project/ProjectData";
import ProjectLayout from "@/components/project/wrappers/ProjectLayout";
import Tag from "@/components/common/Tag";
export default {
  components: {
    ProjectData,
    ProjectLayout,
    Tag,
  },
  async fetch({ store, params, error }) {
    await fetchProjectData(store, params, error);
    if (
      !store.state.project.published ||
      store.state.project.published.name === null
    ) {
      error({
        statusCode: 404,
        message: "Project is not published",
      });
    }
  },
};
</script>

<style lang="less">
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";
</style>
