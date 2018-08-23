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
    </div>
    <div class="FilterItems">
      <filter-item
        :selected="selectedDHI.length > 0"
        label="Digital Health Interventions">
        <digital-health-interventions-list
          :value="selectedDHI"
          actions
          @delete="deleteDhiHandler"
        />
      </filter-item>
      <filter-item
        :selected="selectedHFA.length > 0"
        label="Health Focus Area">
        <health-focus-areas-list
          :value="selectedHFA"
          actions
          @delete="deleteHfaHandler"
        />
      </filter-item>
      <filter-item
        :selected="selectedHSC.length > 0"
        label="Health System Challenges">
        <health-system-challenges-list
          :value="selectedHSC"
          actions
          @delete="deleteHscHandler"
        />
      </filter-item>
      <filter-item
        :selected="selectedHIS.length > 0"
        label="Health Information System">
        <his-bucket-list
          :value="selectedHIS"
          actions
          @delete="deleteHisHandler"
        />
      </filter-item>
      <filter-item
        :selected="selectedPlatforms.length > 0"
        label="Software" >
        <simple-platform-list
          :value="selectedPlatforms"
          actions
          @delete="deletePlatformsHandler"
        />
      </filter-item>
    </div>
  </div>
</template>

<script>
import FilterPresetsActions from './FilterPresetsActions';
import SearchBox from './SearchBox';
import CountryFilters from './CountryFilters';
import FilterSwitch from './FilterSwitch';
import FilterItem from './FilterItem';
import DigitalHealthInterventionsList from '../common/list/DigitalHealthInterventionsList';
import HealthFocusAreasList from '../common/list/HealthFocusAreasList';
import HealthSystemChallengesList from '../common/list/HealthSystemChallengesList';
import HisBucketList from '../common/list/HisBucketList';
import SimplePlatformList from '../common/list/SimplePlatformList';
export default {
  components: {
    FilterPresetsActions,
    SearchBox,
    CountryFilters,
    FilterSwitch,
    FilterItem,
    DigitalHealthInterventionsList,
    HealthFocusAreasList,
    HealthSystemChallengesList,
    HisBucketList,
    SimplePlatformList
  },
  data () {
    return {
      governamentApproved: false,
      governamentFinanced: false,
      onlyMyDonor: false,
      selectedDHI: [113, 114],
      selectedHFA: [31],
      selectedHSC: [18],
      selectedHIS: [1],
      selectedPlatforms: [4]
    };
  },
  methods: {
    deleteDhiHandler (id) {
      this.selectedDHI = this.selectedDHI.filter(dhi => dhi !== id);
    },
    deleteHfaHandler (id) {
      this.selectedHFA = this.selectedHFA.filter(hfa => hfa !== id);
    },
    deleteHscHandler (id) {
      this.selectedHSC = this.selectedHSC.filter(hsc => hsc !== id);
    },
    deleteHisHandler (id) {
      this.selectedHIS = this.selectedHIS.filter(his => his !== id);
    },
    deletePlatformsHandler (id) {
      this.selectedPlatforms = this.selectedPlatforms.filter(p => p !== id);
    }
  }
};

</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .AdvancedSearch {
    box-sizing: border-box;
    width: @advancedSearchWidth;
    // TODO
    // height: fixed???;
    border-left: 1px solid @colorGrayLight;
    background-color: @colorWhite;

    // search filters blocks
    > div {
      padding: 20px;
      border-bottom: 1px solid @colorGrayLight;

      &:last-child {
        border: 0;
      }
    }

    .FilterSwitches {}
  }
</style>
