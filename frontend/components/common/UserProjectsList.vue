<template>
  <div class="UserProjectsList">
    <empty-projects v-if="!hasProjects" />
    <extended-project-card
      v-for="project in userProjecList"
      :key="project.id"
      :id="project.id"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import EmptyProjects from './EmptyProjects';
import ExtendedProjectCard from '../common/ExtendedProjectCard';

export default {
  components: {
    EmptyProjects,
    ExtendedProjectCard
  },
  computed: {
    ...mapGetters({
      userProjecList: 'projects/getUserProjectList'
    }),
    hasProjects () {
      return this.userProjecList.length > 0;
    }
  }
};
</script>

<style>

</style>
