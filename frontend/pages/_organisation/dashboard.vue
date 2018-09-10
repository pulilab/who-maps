<template>
  <div class="DashboardArea">

    <transition name="el-fade-in">
      <div
        v-show="loading"
        class="DashboardLoader">
        <div>
          <div class="Loader">
            <div />
            <span>Updating filters and datapoints</span>
          </div>
        </div>
      </div>
    </transition>

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
    position: relative;
    display: flex;
    overflow: hidden;
    width: 100vw;
    min-width: @appWidthMinLimit;
    max-width: @appWidthMaxLimit;
    height: calc(100vh - @topBarHeight - @actionBarHeight - @appFooterHeight);

    .DashboardLoader {
      z-index: 3;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255,255,255,.5);

      > div {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        background-color: rgba(255,255,255,.9);
        border-radius: 5px;
        box-shadow: 0 4px 12px 0 rgba(0,0,0,.12);
      }
    }

    .ChildContainer {
      z-index: 1;
      position: relative;
      width: calc(100vw - @advancedSearchWidth);
      min-width: @appWidthMinLimit - @advancedSearchWidth;
      max-width: @appWidthMaxLimit - @advancedSearchWidth;
      height: 100%;

      .DashboardMap {
        height: calc(100vh - @topBarHeight - @actionBarHeight - @appFooterHeight);
      }
    }

    .FilterArea {
      z-index: 2;
      position: relative;
      width: @advancedSearchWidth;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
</style>
