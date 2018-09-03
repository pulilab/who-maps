<template>
  <div class="DashboardArea">
    <div
      v-show="loading"
      class="Loader"
    >
      <div />
      <span>Updating filters and datapoints</span>
    </div>
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
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    AdvancedSearch
  },
  middleware: ['isLoggedIn'],
  async fetch ({store}) {
    await Promise.all([
      store.dispatch('projects/loadUserProjects'),
      store.dispatch('projects/loadProjectStructure'),
      store.dispatch('dashboard/loadProjectList')
    ]);
  },
  computed: {
    ...mapGetters({
      searchParameters: 'dashboard/getSearchParameters',
      loading: 'dashboard/getLoading'
    })
  },
  watch: {
    searchParameters: {
      immediate: false,
      handler (params) {
        this.loadProjectList();
      }
    }
  },
  methods: {
    ...mapActions({
      loadProjectList: 'dashboard/loadProjectList'
    })
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .DashboardArea {
    display: flex;
    overflow: hidden;
    width: 100vw;
    min-width: @appWidthMinLimit;
    max-width: @appWidthMaxLimit;
    height: calc(100vh - @topBarHeight - @actionBarHeight - @appFooterHeight);

    .ChildContainer {
      width: calc(100vw - @advancedSearchWidth);
      min-width: @appWidthMinLimit - @advancedSearchWidth;
      max-width: @appWidthMaxLimit - @advancedSearchWidth;
      height: 100%;

      .DashboardMap {
        height: calc(100vh - @topBarHeight - @actionBarHeight - @appFooterHeight);
      }
    }

    .FilterArea {
      width: @advancedSearchWidth;
      height: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
    }
  }
</style>
