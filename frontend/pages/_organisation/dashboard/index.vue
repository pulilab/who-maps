<template>
  <div class="DashboardMapView">
    <dashboard-map />
  </div>
</template>

<script>
import DashboardMap from '../../../components/dashboard/DashboardMap';
import { mapGetters, mapActions } from 'vuex';
export default {
  components: {
    DashboardMap
  },
  async fetch ({store}) {
    await Promise.all([
      store.dispatch('projects/loadUserProjects'),
      store.dispatch('projects/loadProjectStructure'),
      store.dispatch('dashboard/loadProjectsMap')
    ]);
  },
  computed: {
    ...mapGetters({
      searchParameters: 'dashboard/getSearchParameters'
    })
  },
  watch: {
    searchParameters: {
      immediate: false,
      handler (params) {
        this.loadProjectsMap();
      }
    }
  },
  methods: {
    ...mapActions({
      loadProjectsMap: 'dashboard/loadProjectsMap'
    })
  }
};
</script>

<style>

</style>
