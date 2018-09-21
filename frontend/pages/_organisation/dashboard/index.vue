<template>
  <div class="DashboardMapView">
    <dashboard-map />
    <dashboard-project-box />
  </div>
</template>

<script>
import DashboardMap from '../../../components/dashboard/DashboardMap';
import DashboardProjectBox from '../../../components/dashboard/DashboardProjectBox';
import { mapGetters, mapActions } from 'vuex';
export default {
  components: {
    DashboardMap,
    DashboardProjectBox
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
        this.load();
      }
    }
  },
  methods: {
    ...mapActions({
      loadProjectsMap: 'dashboard/loadProjectsMap'
    }),
    async load () {
      this.$nuxt.$loading.start();
      await this.loadProjectsMap();
      this.$nuxt.$loading.finish();
    }
  }
};
</script>

<style lang="less">
  .DashboardMapView {
    position: relative;
  }

</style>
