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
        v-model="selectedCountries"
        :disabled="disableCountries"
      />
      <region-select
        v-model="selectedRegion"
        :disabled="disableRegions"
      />
      <stage-select
        v-model="selectedStages"
        :disabled="disableStages"
      />
    </div>
  </div>
</template>

<script>
import { mapGettersActions } from '../../utilities/form.js';
import CountrySelect from '@/components/common/CountrySelect';
import RegionSelect from '@/components/common/RegionSelect';
import StageSelect from '@/components/common/StageSelect';

import { mapGetters } from 'vuex';

export default {
  components: {
    CountrySelect,
    RegionSelect,
    StageSelect
  },
  computed: {
    ...mapGetters({
      dashboardType: 'dashboard/getDashboardType'
    }),
    ...mapGettersActions({
      selectedCountries: ['dashboard', 'getFilteredCountries', 'setFilteredCountries'],
      selectedRegion: ['dashboard', 'getFilteredRegion', 'setFilteredRegion'],
      selectedStages: ['dashboard', 'getFilteredStages', 'setFilteredStages']
    }),
    disableCountries () {
      return !!this.selectedRegion || this.dashboardType === 'country' || this.selectedGlobal;
    },
    disableRegions () {
      return this.selectedCountries.length > 0 || this.dashboardType === 'country' || this.selectedGlobal;
    },
    disableStages () {
      return false;
    },
    selectedGlobal: {
      set (val) {
        this.selectedCountries = val ? [process.env.GlobalCountryID] : [];
      },
      get () {
        return this.selectedCountries.length > 0 && this.selectedCountries[0] === process.env.GlobalCountryID;
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
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
</style>
