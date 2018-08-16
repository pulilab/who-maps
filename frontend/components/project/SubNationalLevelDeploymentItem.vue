<template>
  <div class="SubNationalLevelDeploymentItem">
    <el-form-item :label="levelName">
      <el-select
        :value="subLevel"
        filterable
        popper-class="SubNationalLevelDeploymentItemDropdown"
        class="SubNationalLevelDeploymentItem"
        placeholder="Select from list"
        @change="changeHandler">

        <el-option
          v-for="sub in availableSubLevels"
          :key="sub.id"
          :label="sub.name"
          :value="sub.id"/>
      </el-select>
      <facility-selector
        v-model="facilitiesList"
        :disabled="!subLevel"
      />
      <coverage-fieldset
        :health-workers.sync="healthWorkers"
        :clients.sync="clients"
        :facilities.sync="facilities"
        :disabled="!subLevel"
        :selected-facilities="facilitiesList"
      />
    </el-form-item>
  </div>
</template>

<script>

import CoverageFieldset from './CoverageFieldset';
import FacilitySelector from './FacilitySelector';

import { mapGettersActions } from '../../utilities/form';

export default {
  components: {
    CoverageFieldset,
    FacilitySelector
  },
  props: {
    index: {
      type: [Number],
      default: null
    },
    levelName: {
      type: String,
      required: true
    },
    subLevels: {
      type: Array,
      required: true
    },
    coverage: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGettersActions({
      coverageData: ['project', 'getCoverageData', 'setCoverageData']
    }),
    subLevel () {
      return this.coverage[this.index];
    },
    availableSubLevels () {
      return this.subLevels.filter(tp => !this.coverage.some(s => s === tp.id) || tp.id === this.subLevel);
    },
    localCoverageData () {
      return this.coverageData[this.subLevel];
    },
    facilitiesList: {
      get () {
        return this.localCoverageData ? this.localCoverageData.facilities_list : [];
      },
      set (value) {
        const coverage = {facilities_list: [...value]};
        this.coverageData = {coverage, subLevel: this.subLevel};
      }
    },
    healthWorkers: {
      get () {
        return this.localCoverageData ? this.localCoverageData.health_workers : null;
      },
      set (value) {
        const coverage = {health_workers: value};
        this.coverageData = {coverage, subLevel: this.subLevel};
      }
    },
    clients: {
      get () {
        return this.localCoverageData ? this.localCoverageData.clients : null;
      },
      set (value) {
        const coverage = {clients: value};
        this.coverageData = {coverage, subLevel: this.subLevel};
      }
    },
    facilities: {
      get () {
        return this.localCoverageData ? this.localCoverageData.facilities : null;
      },
      set (value) {
        const coverage = {facilities: value};
        this.coverageData = {coverage, subLevel: this.subLevel};
      }
    }
  },
  methods: {
    changeHandler (value) {
      const cov = [...this.coverage];
      cov[this.index] = value;
      this.$emit('update:coverage', cov);
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .SubNationalLevelDeploymentItem {
    width: 100%;
  }

  .SubNationalLevelDeploymentItemDropdown {}
</style>
