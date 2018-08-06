<template>
  <div class="MyProjects">
    <h3> My Projects </h3>
    <user-project-list />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import UserProjectList from '../../../components/common/UserProjectsList';

export default {
  components: {
    UserProjectList
  },
  computed: {
    ...mapGetters({
    })
  }
};
</script>

<style lang="less">
</style>
