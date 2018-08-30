<template>
  <div class="SubNationalLevelDeploymentItem">
    <el-form-item
      :label="levelName"
      :error="errors.first('subLevel')"
    >
      <el-select
        v-validate="rules.subLevel"
        v-model="subLevel"
        :data-vv-as="levelName"
        data-vv-name="subLevel"
        filterable
        popper-class="SubNationalLevelDeploymentRegionDropdown"
        class="SubNationalLevelDeployementRegion"
        placeholder="Select from list"
      >

        <el-option
          v-for="sub in availableSubLevels"
          :key="sub.id"
          :label="sub.name"
          :value="sub.id"/>
      </el-select>
      <facility-selector
        ref="facilitySelector"
        :rules="rules"
        v-model="facilitiesList"
        :disabled="!subLevel"
      />
      <coverage-fieldset
        ref="coverageFieldset"
        :rules="rules"
        :health-workers.sync="healthWorkers"
        :clients.sync="clients"
        :facilities.sync="facilities"
        :disabled="!subLevel"
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
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    propPrefix: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGettersActions({
      coverageData: ['project', 'getCoverageData', 'setCoverageData', 0]
    }),
    subLevel: {
      get () {
        return this.coverage[this.index];
      },
      set (value) {
        const cov = [...this.coverage];
        cov[this.index] = value;
        this.$emit('update:coverage', cov);
      }
    },
    availableSubLevels () {
      return this.subLevels.filter(tp => !this.coverage.some(s => s === tp.id) || tp.id === this.subLevel);
    },
    localCoverageData () {
      return this.coverageData[this.subLevel];
    },
    facilitiesList: {
      get () {
        const facilitiesList = this.localCoverageData ? this.localCoverageData.facilities_list : [];
        return facilitiesList || [];
      },
      set (value) {
        const coverage = {facilities_list: [...value], facilities: value.length};
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
    async validate () {
      const validations = await Promise.all([
        this.$validator.validateAll(),
        this.$refs.coverageFieldset.validate(),
        this.$refs.facilitySelector.validate()
      ]);
      return validations.reduce((a, c) => a && c, true);
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .SubNationalLevelDeployementRegion {
    width: 100%;
    margin-bottom: 20px;
  }
</style>
