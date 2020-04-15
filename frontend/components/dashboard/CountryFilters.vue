<template>
  <div>
    <div class="FilterSwitchHandler">
      <el-switch
        v-model="selectedGlobal"
        :active-text="$gettext('Show global projects only') | translate"
      />
    </div>
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
  </div>
</template>

<script>
import { mapGettersActions } from '../../utilities/form.js';
import CountrySelect from '../common/CountrySelect';
import RegionSelect from '../common/RegionSelect';
import { mapGetters } from 'vuex';
export default {
  components: {
    CountrySelect,
    RegionSelect
  },
  computed: {
    ...mapGetters({
      dashboardType: 'dashboard/getDashboardType'
    }),
    ...mapGettersActions({
      selectedCounties: ['dashboard', 'getFilteredCountries', 'setFilteredCountries'],
      selectedRegion: ['dashboard', 'getFilteredRegion', 'setFilteredRegion']
    }),
    disableCountries () {
      return !!this.selectedRegion || this.dashboardType === 'country' || this.selectedGlobal;
    },
    disableRegions () {
      return this.selectedCounties.length > 0 || this.dashboardType === 'country' || this.selectedGlobal;
    },
    selectedGlobal: {
      set (val) {
        this.selectedCounties = val ? [process.env.GlobalCountryID] : [];
      },
      get () {
        return this.selectedCounties.length > 0 && this.selectedCounties[0] === process.env.GlobalCountryID;
      }
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .FilterSwitchHandler {
    margin-bottom: 14px;
    margin-top: -6px;
  }

  .CountryFilters {
    .el-select {
      width: 100%;

      &:first-child {
        margin-bottom: 10px;
      }
    }
  }
</style>
