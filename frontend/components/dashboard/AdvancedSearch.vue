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
        :selected="selectedDHI"
        :limit="4"
        item="dhi"
        label="Digital Health Interventions">
        <dhi-categories-list
          :value="selectedDHI"
          :limit="4"
          actions
          @delete="deleteDhiHandler"
        />
      </filter-item>
      <filter-item
        :selected="selectedHFA"
        :limit="4"
        item="hfa"
        label="Health Focus Area">
        <hfa-categories-list
          :value="selectedHFA"
          :limit="4"
          actions
          @delete="deleteHfaHandler"
        />
      </filter-item>
      <filter-item
        :selected="selectedHSC"
        :limit="4"
        item="hsc"
        label="Health System Challenges">
        <health-system-challenges-list
          :value="selectedHSC"
          :limit="4"
          actions
          @delete="deleteHscHandler"
        />
      </filter-item>
      <filter-item
        :selected="selectedHIS"
        :limit="4"
        item="his"
        label="Health Information System">
        <his-bucket-list
          :value="selectedHIS"
          :limit="4"
          actions
          @delete="deleteHisHandler"
        />
      </filter-item>
      <filter-item
        :selected="selectedPlatforms"
        :limit="4"
        item="platform"
        label="Software" >
        <simple-platform-list
          :value="selectedPlatforms"
          :limit="4"
          actions
          @delete="deletePlatformsHandler"
        />
      </filter-item>
    </div>
  </div>
</template>

<script>
import { mapGettersActions } from '../../utilities/form';

import FilterPresetsActions from './FilterPresetsActions';
import SearchBox from './SearchBox';
import CountryFilters from './CountryFilters';
import FilterSwitch from './FilterSwitch';
import FilterItem from './FilterItem';
import DhiCategoriesList from '../common/list/DhiCategoriesList';
import HfaCategoriesList from '../common/list/HfaCategoriesList';
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
    DhiCategoriesList,
    HfaCategoriesList,
    HealthSystemChallengesList,
    HisBucketList,
    SimplePlatformList
  },
  data () {
    return {
      governamentFinanced: false,
      onlyMyDonor: false
    };
  },
  computed: {
    ...mapGettersActions({
      governamentApproved: ['dashboard', 'getGovernmentApproved', 'setGovernmentApproved', 0],
      selectedDHI: ['dashboard', 'getSelectedDHI', 'setSelectedDHI', 0],
      selectedHFA: ['dashboard', 'getSelectedHFA', 'setSelectedHFA', 0],
      selectedHSC: ['dashboard', 'getSelectedHSC', 'setSelectedHSC', 0],
      selectedHIS: ['dashboard', 'getSelectedHIS', 'setSelectedHIS', 0],
      selectedPlatforms: ['dashboard', 'getSelectedPlatforms', 'setSelectedPlatforms', 0]
    })
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
    min-height: 100%;
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
