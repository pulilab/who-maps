<template>
  <div class="DashboardListView">
    <el-row>
      <table-top-actions />
    </el-row>
    <el-row>
      <main-table />
    </el-row>
  </div>
</template>

<script>
import MainTable from '../../../components/dashboard/MainTable';
import TableTopActions from '../../../components/dashboard/TableTopActions';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    MainTable,
    TableTopActions
  },
  async fetch ({store, query}) {
    await store.dispatch('countries/loadMapData');
    await store.dispatch('dashboard/setSearchOptions', query);
    await Promise.all([
      store.dispatch('projects/loadUserProjects'),
      store.dispatch('projects/loadProjectStructure'),
      store.dispatch('dashboard/loadProjectList')
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
      loadProjectList: 'dashboard/loadProjectList'
    }),
    async load () {
      this.$nuxt.$loading.start();
      await this.loadProjectList();
      this.$nuxt.$loading.finish();
    }
  }
};
</script>

<style>

</style>
