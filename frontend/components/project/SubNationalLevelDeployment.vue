<template>
  <div class="SubNationalLevelDeployment">
    <div
      v-if="countrySubLevelNames.first"
      class="FirstSubLevel"
    >
      <div class="Header">
        <fa icon="map-marker" />
        {{ countrySubLevelNames.first }} level deployment
      </div>
      <el-row
        v-for="(cov, index) in coverage"
        :key="cov"
        type="flex"
      >
        <el-col :span="12">
          <el-form-item prop="coverage">
            <sub-national-level-deployment-item
              :index="index"
              :level-name="countrySubLevelNames.first"
              :sub-levels="countryFirstSubLevel"
              :coverage.sync="coverage"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
        >
          <add-rm-buttons
            :show-add="!!cov"
            :show-rm="coverage.length > 1"
            @add="addCoverage"
            @rm="rmCoverage(index, cov)"
          />
        </el-col>
      </el-row>
    </div>
    <div
      v-if="countrySubLevelNames.second"
      class="SecondSubLevel"
    >
      <div class="Header">
        <fa icon="map-marker" />
        {{ countrySubLevelNames.second }} level deployment
      </div>
      <el-row
        v-for="(cov, index) in coverageSecondLevel"
        :key="cov"
        type="flex"
      >
        <el-col :span="12">
          <el-form-item prop="coverageSecondLevel">
            <sub-national-level-deployment-item
              :index="index"
              :level-name="countrySubLevelNames.second"
              :sub-levels="countrySecondSubLevel"
              :coverage.sync="coverageSecondLevel"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
        >
          <add-rm-buttons
            :show-add="!!cov"
            :show-rm="coverageSecondLevel.length > 1"
            @add="addCoverageSecondLevel"
            @rm="rmCoverageSecondLevel(index, cov)"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapGettersActions } from '../../utilities/form';

import SubNationalLevelDeploymentItem from './SubNationalLevelDeploymentItem';
import AddRmButtons from './AddRmButtons';

export default {
  components: {
    SubNationalLevelDeploymentItem,
    AddRmButtons
  },
  computed: {
    ...mapGetters({
      country: 'project/getCountry',
      getCountrySubLevelNames: 'countries/getCountrySubLevelNames',
      getCountryFirstSubLevel: 'countries/getCountryFirstSubLevel',
      getCountrySecondSubLevel: 'countries/getCountrySecondSubLevel'
    }),
    ...mapGettersActions({
      coverage: ['project', 'getCoverage', 'setCoverage'],
      coverageData: ['project', 'getCoverageData', 'setCoverageData'],
      coverageSecondLevel: ['project', 'getCoverageSecondLevel', 'setCoverageSecondLevel']
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
  },
  methods: {
    addCoverage () {
      this.coverage = [...this.coverage, null];
    },
    rmCoverage (index, id) {
      this.coverage = this.coverage.filter((c, i) => i !== index);
      if (id) {
        this.coverageData = {subLevel: id, coverage: undefined};
      }
    },
    addCoverageSecondLevel () {
      this.coverageSecondLevel = [...this.coverageSecondLevel, null];
    },
    rmCoverageSecondLevel (index, id) {
      this.coverageSecondLevel = this.coverageSecondLevel.filter((c, i) => i !== index);
      if (id) {
        this.coverageData = {subLevel: id, coverage: undefined};
      }
    }
  }
};
</script>

<style lang="less">
.SubNationalLevelDeployment {
  width: 100%;
}

</style>
