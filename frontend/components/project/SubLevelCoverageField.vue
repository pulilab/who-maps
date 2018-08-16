<template>
  <div class="SubNationalCoverageField">

    <simple-field
      v-if="countrySubLevelNames.first"
      class="FirstSubLevel">
      <div slot="header">
        <fa icon="map-marker" />
        {{ countrySubLevelNames.first }} level deployment
      </div>
      <el-row
        v-for="(cov) in coverage"
        :key="cov"
        type="flex"
      >
        <el-col :span="24">
          <sub-level-item
            :level-name="countrySubLevelNames.first"
            :coverage="cov"
            :coverage-data="coverageData"
            :sub-levels="countryFirstSubLevel"
          />
        </el-col>
      </el-row>
    </simple-field>

    <simple-field
      v-if="countrySubLevelNames.second"
      class="SecondSubLevel"
    >
      <div slot="header">
        <fa icon="map-marker" />
        {{ countrySubLevelNames.second }} level deployment
      </div>
      <el-row
        v-for="(cov) in coverageSecondLevel"
        :key="cov"
        type="flex"
      >
        <el-col :span="24">
          <sub-level-item
            :level-name="countrySubLevelNames.second"
            :coverage="cov"
            :coverage-data="coverageData"
            :sub-levels="countrySecondSubLevel"
          />
        </el-col>
      </el-row>
    </simple-field>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import SubLevelItem from './SubLevelItem';
import SimpleField from './SimpleField';

export default {
  components: {
    SubLevelItem,
    SimpleField
  },
  props: {
    coverage: {
      type: Array,
      default: () => []
    },
    coverageSecondLevel: {
      type: Array,
      default: () => []
    },
    coverageData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters({
      country: 'project/getCountry',
      getCountrySubLevelNames: 'countries/getCountrySubLevelNames',
      getCountryFirstSubLevel: 'countries/getCountryFirstSubLevel',
      getCountrySecondSubLevel: 'countries/getCountrySecondSubLevel'
    }),
    countrySubLevelNames () {
      return this.getCountrySubLevelNames(this.country);
    },
    countryFirstSubLevel () {
      const result = this.getCountryFirstSubLevel(this.country);
      return result || [];
    },
    countrySecondSubLevel () {
      const result = this.getCountrySecondSubLevel(this.country);
      return result || [];
    }
  }
};
</script>

<style lang="less">
.SubNationalCoverageField {
  width: 100%;
}

</style>
