<template>
  <div class="AdvancedSearch">
    <filter-presets-actions />
    <search-box />
    <country-filters />
    <div class="FilterSwitches">
      <filter-switch
        v-model="onlyMyDonor"
        label="Only my Donor Projects"
        tooltip="Lorem ipsum something else"
      />
      <filter-switch
        v-model="governamentApproved"
        label="Only MOH Verified Projects"
        tooltip="Lorem ipsum something else"
      />
      <filter-switch
        v-model="governamentFinanced"
        label="Government financed"
        tooltip="Lorem ipsum something else"
      />
      <div class="FilterItems">
        <filter-item
          :selected="selectedDHI.length > 0"
          label="Digital Health Interventions" >
          <div
            v-for="dhi in selectedDHI"
            :key="dhi" >
            <fa icon="check"/>
            <digital-health-intervention-item :id="dhi" />
          </div>
        </filter-item>
        <filter-item
          :selected="selectedHFA.length > 0"
          label="Health Focus Area" >
          <div
            v-for="hfa in selectedHFA"
            :key="hfa" >
            <fa icon="check"/>
            <digital-health-intervention-item :id="hfa" />
          </div>
        </filter-item>
        <filter-item
          :selected="selectedHSC.length > 0"
          label="Health System Challenges" >
          <div
            v-for="hsc in selectedHSC"
            :key="hsc" >
            <fa icon="check"/>
            <digital-health-intervention-item :id="hsc" />
          </div>
        </filter-item>
        <filter-item
          :selected="selectedHIS.length > 0"
          label="Health Information System" >
          <div
            v-for="his in selectedHIS"
            :key="his" >
            <fa icon="check"/>
            <digital-health-intervention-item :id="his" />
          </div>
        </filter-item>
        <filter-item
          :selected="software.length > 0"
          label="Software" >
          <div
            v-for="s in software"
            :key="s" >
            <fa icon="check"/>
            <digital-health-intervention-item :id="s" />
          </div>
        </filter-item>
      </div>
    </div>
  </div>
</template>

<script>
import FilterPresetsActions from './FilterPresetsActions';
import SearchBox from './SearchBox';
import CountryFilters from './CountryFilters';
import FilterSwitch from './FilterSwitch';
import FilterItem from './FilterItem';
import DigitalHealthInterventionItem from '../common/DigitalHealthInterventionItem';
export default {
  components: {
    FilterPresetsActions,
    SearchBox,
    CountryFilters,
    FilterSwitch,
    FilterItem,
    DigitalHealthInterventionItem
  },
  data () {
    return {
      governamentApproved: false,
      governamentFinanced: false,
      onlyMyDonor: false,
      selectedDHI: [113, 114],
      selectedHFA: [],
      selectedHSC: [],
      selectedHIS: [],
      software: []
    };
  }
};
</script>

<style lang="less">
.AdvancedSearch {
}

</style>
