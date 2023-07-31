<template>
  <div class="DashboardArea">
    <div class="ChildContainer">
      <nuxt-child />
    </div>

    <div class="FilterArea">
      <PolicySearch />
    </div>
  </div>
</template>

<script>
import PolicySearch from '@/components/registry/PolicySearch'

export default {
  name: 'PolicyRegistry',
  components: {
    PolicySearch,
  },
  async fetch ({ store }) {
    await store.dispatch('system/loadUserProfiles'),
    await store.dispatch('system/loadCountries'),
    await store.dispatch('projects/loadProjectStructure'),
    await store.dispatch('admin/country/fetchData', false)
  }
}
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
    height: calc(100vh - @topBarHeightSubpage - @actionBarHeight - @appFooterHeight);

    .ChildContainer {
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
      width: @advancedSearchWidth;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
</style>