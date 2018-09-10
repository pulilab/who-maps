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
import isEmpty from 'lodash/isEmpty';
import AdvancedSearch from '../../components/dashboard/AdvancedSearch';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    AdvancedSearch
  },
  middleware: ['isLoggedIn'],
  fetch ({query, store}) {
    if (!isEmpty(query)) {
      store.dispatch('dashboard/setSearchOptions', query);
    }
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
      handler (query) {
        this.$router.replace({...this.$route, query});
      }
    }
  },
  mounted () {
    if (isEmpty(this.$route.query)) {
      this.$router.replace({...this.$route, query: this.searchParameters});
    }
    if (window) {
      const savedFilters = window.localStorage.getItem('savedFilters');
      if (savedFilters) {
        this.setSavedFilters(JSON.parse(savedFilters));
      }
    }
  },
  methods: {
    ...mapActions({
      setSavedFilters: 'dashboard/setSavedFilters'
    })
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .DashboardArea {

    .Loader {
      // posit
    }
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
      overflow-y: auto;
    }
  }
</style>
