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
import AdvancedSearch from '../../components/dashboard/AdvancedSearch'
import { mapActions } from 'vuex'

export default {
  name: 'Dashboard',
  components: {
    AdvancedSearch
  },
  middleware: ['authGuard'],
  fetch ({ store }) {
    store.dispatch('landing/resetSearch')
  },
  mounted () {
    if (window) {
      const savedFilters = window.localStorage.getItem('savedFilters')
      if (savedFilters) {
        this.setSavedFilters(JSON.parse(savedFilters))
      }
    }
  },
  methods: {
    ...mapActions({
      setSavedFilters: 'dashboard/setSavedFilters'
    })
  }
}
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
    height: calc(100vh - @topBarHeightSubpage - @actionBarHeight - @appFooterHeight);

    .ChildContainer {
      z-index: 1;
      position: relative;
      width: calc(100vw - @advancedSearchWidth);
      min-width: @appWidthMinLimit - @advancedSearchWidth;
      max-width: @appWidthMaxLimit - @advancedSearchWidth;
      height: 100%;

      .DashboardMap {
        height: calc(100vh - @topBarHeightSubpage - @actionBarHeight - @appFooterHeight);
        min-height: auto;
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
