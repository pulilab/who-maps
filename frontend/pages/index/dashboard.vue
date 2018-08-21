<template>
  <div class="DashboardArea">
    <div class="ChildContainer">
      <nuxt-child />
    </div>
    <div class="FilterArea">
      <advanced-search />
    </div>
  </div>
</template>

<script>
import AdvancedSearch from '../../components/dashboard/AdvancedSearch';

export default {
  components: {
    AdvancedSearch
  },
  middleware: ['isLoggedIn'],
  async fetch ({store}) {
    await Promise.all([
      store.dispatch('projects/loadUserProjects'),
      store.dispatch('projects/loadProjectStructure')
    ]);
  }
};
</script>

<style lang="less">
.DashboardArea {
  display: flex;
  .ChildContainer {
    width: 75%;
  }
  .FilterArea {
    width: 25%;
    flex-grow: 0;
  }
}

</style>
