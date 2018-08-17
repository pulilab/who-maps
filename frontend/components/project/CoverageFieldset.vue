<template>
  <div class="CoverageFieldset">
    <el-row
      :gutter="20"
      type="flex"
    >
      <el-col :span="8">
        <el-form-item
          :prop="healthWorkersProp"
          label="# Health workers">
          <el-input
            :disabled="disabled"
            :value="healthWorkers"
            type="number"
            min="0"
            max="10000000"
            step="1"
            @change="emitHealthWorkersChange" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          :prop="facilitiesProp"
          label="# Facilities">
          <el-input
            :disabled="disableFacilities"
            :value="facilities"
            type="number"
            min="0"
            max="10000000"
            step="1"
            @change="emitFacilitiesChange"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          :prop="clientsProp"
          label="# Clients">
          <el-input
            :disabled="disabled"
            :value="clients"
            type="number"
            min="0"
            max="10000000"
            step="1"
            @change="emitClientsChange"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    disabled: {
      type: Boolean,
      default: true
    },
    healthWorkers: {
      type: [Number, String],
      default: null
    },
    clients: {
      type: [Number, String],
      default: null
    },
    facilities: {
      type: [Number, String],
      default: null
    },
    isNlc: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      country: 'project/getCountry',
      getFacilities: 'countries/getCountryFacilityList'
    }),
    hasFacilityList () {
      return !!this.getFacilities(this.country).length;
    },
    disableFacilities () {
      return !!(this.disabled || this.hasFacilityList);
    },
    healthWorkersProp () {
      if (this.isNlc) {
        return 'national_level_deployment.health_workers';
      }
    },
    clientsProp () {
      if (this.isNlc) {
        return 'national_level_deployment.clients';
      }
    },
    facilitiesProp () {
      if (this.isNlc) {
        return 'national_level_deployment.facilities';
      }
    }
  },
  methods: {
    emitHealthWorkersChange (value) {
      this.$emit('update:healthWorkers', value);
    },
    emitFacilitiesChange (value) {
      this.$emit('update:facilities', value);
    },
    emitClientsChange (value) {
      this.$emit('update:clients', value);
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .CoverageFieldset {}
</style>
