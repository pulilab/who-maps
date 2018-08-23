<template>
  <div class="FilterArea">
    <digital-health-interventions-filter
      v-show="selectedFilterArea === 'dhi'"
      ref="dhi" />
    <health-focus-areas-filter
      v-show="selectedFilterArea === 'hfa'"
      ref="hfa" />
    <health-system-challenges-filter
      v-show="selectedFilterArea === 'hsc'"
      ref="hsc" />
    <health-information-system-filter
      v-show="selectedFilterArea === 'his'"
      ref="his" />
    <platform-filter
      v-show="selectedFilterArea === 'platform'"
      ref="platform" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import HealthFocusAreasFilter from './filters/HealthFocusAreaFilter';
import DigitalHealthInterventionsFilter from './filters/DigitalHealthInterventionsFilter';
import HealthInformationSystemFilter from './filters/HealthInformationSystemFilter';
import HealthSystemChallengesFilter from './filters/HealthSystemChallengesFilter';
import PlatformFilter from './filters/PlatformFilter';

export default {
  components: {
    HealthFocusAreasFilter,
    DigitalHealthInterventionsFilter,
    HealthInformationSystemFilter,
    HealthSystemChallengesFilter,
    PlatformFilter
  },
  computed: {
    ...mapGetters({
      selectedFilterArea: 'layout/getDashboardFiltersDialogState'
    })
  },
  methods: {
    applyFilters () {
      this.$refs.dhi.save();
      this.$refs.hfa.save();
      this.$refs.hsc.save();
      this.$refs.dhi.save();
      this.$refs.his.save();
      this.$refs.platform.save();
    },
    clearAll () {
      this.$refs.dhi.clear();
      this.$refs.hfa.clear();
      this.$refs.hsc.clear();
      this.$refs.dhi.clear();
      this.$refs.his.clear();
      this.$refs.platform.clear();
    }
  }
};
</script>

<style>

</style>
