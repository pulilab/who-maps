<template>
  <div class="CountryFilters">
    <country-select
      v-model="selectedCounties"
      :disabled="disableCountries"
    />
    <region-select
      v-model="selectedRegion"
      :disabled="disableRegions"
    />
  </div>
</template>

<script>
import { mapGettersActions } from '../../utilities/form.js';

import CountrySelect from '../common/CountrySelect';
import RegionSelect from '../common/RegionSelect';
export default {
  components: {
    CountrySelect,
    RegionSelect
  },
  computed: {
    ...mapGettersActions({
      selectedCounties: ['dashboard', 'getFilteredCountries', 'setFilteredCountries'],
      selectedRegion: ['dashboard', 'getFilteredRegion', 'setFilteredRegion']
    }),
    disableCountries () {
      return !!this.selectedRegion;
    },
    disableRegions () {
      return this.selectedCounties.length > 0;
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .CountryFilters {
    .el-select {
      width: 100%;

      &:first-child {
        margin-bottom: 10px;
      }
    }
  }
</style>
