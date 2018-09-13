<template>
  <div class="SubNationalLevelDeployment ItemIndent">
    <div
      v-if="countrySubLevelNames.first"
      class="FirstSubLevel"
    >
      <div class="CoverageSubtitle">
        <fa icon="map-marker-alt" />
        <translate :parameters="{name: countrySubLevelNames.first}">{name} level deployment</translate>
      </div>
      <el-row
        v-for="(cov, index) in coverage"
        :key="cov"
        type="flex"
        class="CoverageWrapper"
      >
        <el-col :span="16">
          <el-form-item>
            <sub-national-level-deployment-item
              ref="firstSubLevel"
              :rules="rules.coverage"
              :api-errors="apiErrors"
              :index="index"
              :level-name="countrySubLevelNames.first"
              :sub-levels="countryFirstSubLevel"
              :coverage.sync="coverage"
              scope="coverage"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
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
      <div class="CoverageSubtitle">
        <fa icon="map-marker-alt" />
        <translate :parameters="{name: countrySubLevelNames.first}">{name} level deployment</translate>
      </div>
      <el-row
        v-for="(cov, index) in coverageSecondLevel"
        :key="cov"
        type="flex"
      >
        <el-col :span="16">
          <el-form-item prop="coverageSecondLevel">
            <sub-national-level-deployment-item
              ref="secondSubLevel"
              :rules="rules.coverage_second_level"
              :api-errors="apiErrors"
              :index="index"
              :level-name="countrySubLevelNames.second"
              :sub-levels="countrySecondSubLevel"
              :coverage.sync="coverageSecondLevel"
              scope="coverage_second_level"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
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
import VeeValidationMixin from '../mixins/VeeValidationMixin.js';

import SubNationalLevelDeploymentItem from './SubNationalLevelDeploymentItem';
import AddRmButtons from './AddRmButtons';

export default {
  components: {
    SubNationalLevelDeploymentItem,
    AddRmButtons
  },
  mixins: [VeeValidationMixin],
  computed: {
    ...mapGetters({
      country: 'project/getCountry',
      getCountrySubLevelNames: 'countries/getCountrySubLevelNames',
      getCountryFirstSubLevel: 'countries/getCountryFirstSubLevel',
      getCountrySecondSubLevel: 'countries/getCountrySecondSubLevel'
    }),
    ...mapGettersActions({
      coverage: ['project', 'getCoverage', 'setCoverage', 0],
      coverageData: ['project', 'getCoverageData', 'setCoverageData', 0],
      coverageSecondLevel: ['project', 'getCoverageSecondLevel', 'setCoverageSecondLevel', 0]
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
    async validate () {
      const validators = await Promise.all(this.$refs.firstSubLevel.map(s => s.validate()));
      if (this.countrySubLevelNames.second) {
        validators.push(...await Promise.all(this.$refs.secondSubLevel.map(s => s.validate())));
      }
      console.log('sub natioal level deployment', validators);
      return validators.reduce((a, c) => a && c, true);
    },
    clear () {
      this.errors.clear();
      this.$refs.firstSubLevel.clear();
      if (this.countrySubLevelNames.second) {
        this.$refs.secondSubLeve.clear();
      }
    },
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
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .SubNationalLevelDeployment {
    width: 100%;

    .CoverageWrapper {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid @colorGrayLight;
    }

    .CoverageSubtitle + .CoverageWrapper {
      margin: 0;
      padding: 0;
      border: 0;
    }

    .AddRmButtons {
      margin-top: 49px;
    }
  }
</style>
