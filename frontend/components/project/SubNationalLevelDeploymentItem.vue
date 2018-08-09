<template>
  <div class="SubNationalLevelDeploymentItem">
    <el-form-item :label="levelName">
      <el-select
        :value="value"
        filterable
        popper-class="SubNationalLevelDeploymentItemDropdown"
        class="SubNationalLevelDeploymentItem"
        placeholder="Select from list"
        @change="changeHandler">

        <el-option
          v-for="subLevel in availableSubLevels"
          :key="subLevel.id"
          :label="subLevel.name"
          :value="subLevel.id"/>
      </el-select>
      <coverage-fieldset
        :health-workers.sync="healthWorkers"
        :clients.sync="clients"
        :facilities.sync="facilities"
        :disabled="!value"
      />
    </el-form-item>
  </div>
</template>

<script>

import CoverageFieldset from './CoverageFieldset';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    CoverageFieldset
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [Number, String],
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
    selected: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters({
      getCurrentProjectCoverage: 'projects/getCurrentProjectCoverage'
    }),
    availableSubLevels () {
      return this.subLevels.filter(tp => !this.selected.some(s => s.id === tp.id) || tp.id === this.value);
    },
    coverage () {
      return this.getCurrentProjectCoverage[this.value];
    },
    healthWorkers: {
      get () {
        return this.coverage ? this.coverage.healthWorkers : null;
      },
      set (value) {
        const coverage = {healthWorkers: value};
        this.setCurrentProjectCoverage({coverage, district: this.value});
      }
    },
    clients: {
      get () {
        return this.coverage ? this.coverage.clients : null;
      },
      set (value) {
        const coverage = {clients: value};
        this.setCurrentProjectCoverage({coverage, district: this.value});
      }
    },
    facilities: {
      get () {
        return this.coverage ? this.coverage.facilities : null;
      },
      set (value) {
        const coverage = {facilities: value};
        this.setCurrentProjectCoverage({coverage, district: this.value});
      }
    }
  },
  methods: {
    ...mapActions({
      setCurrentProjectCoverage: 'projects/setCurrentProjectCoverage'
    }),
    changeHandler (value) {
      this.$emit('change', value);
    }
  }
};
</script>

<style lang="less">
.SubNationalLevelDeploymentItem {
  width: 100%;
}
.SubNationalLevelDeploymentItemDropdown {

}
</style>
