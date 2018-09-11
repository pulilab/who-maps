<template>
  <div class="CoverageFieldset">
    <el-row
      :gutter="20"
      type="flex"
    >
      <el-col :span="8">
        <el-form-item
          :error="errors.first('health_workers', scope)"
          :label="$gettext('# Health workers')">
          <el-input
            v-validate="rules.health_workers"
            :disabled="disabled"
            :data-vv-scope="scope"
            v-model="localHealthWorkers"
            data-vv-name="health_workers"
            data-vv-as="Health workers"
            type="number"
            min="0"
            max="10000000"
            step="1"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          :error="errors.first('facilities', scope)"
          :label="$gettext('# Facilities')">
          <el-input
            v-validate="rules.facilities"
            :disabled="disableFacilities"
            :data-vv-scope="scope"
            v-model="localFacilities"
            data-vv-name="facilities"
            data-vv-as="Facilities"
            type="number"
            min="0"
            max="10000000"
            step="1"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          :error="errors.first('clients', scope)"
          :label="$gettext('# Clients')">
          <el-input
            v-validate="rules.clients"
            :disabled="disabled"
            :data-vv-scope="scope"
            v-model="localClients"
            data-vv-name="clients"
            data-vv-as="Clients"
            type="number"
            min="0"
            max="10000000"
            step="1"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VeeValidationMixin from '../mixins/VeeValidationMixin.js';

export default {
  mixins: [VeeValidationMixin],
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
    },
    scope: {
      type: String,
      default: null
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
      if (this.isNlc) {
        return false;
      }
      return !!(this.disabled || this.hasFacilityList);
    },
    localHealthWorkers: {
      get () {
        return this.healthWorkers;
      },
      set (value) {
        this.$emit('update:healthWorkers', value);
      }
    },
    localClients: {
      get () {
        return this.clients;
      },
      set (value) {
        this.$emit('update:clients', value);
      }
    },
    localFacilities: {
      get () {
        return this.facilities;
      },
      set (value) {
        this.$emit('update:facilities', value);
      }
    }
  },
  methods: {
    async validate () {
      return this.$validator.validate();
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .CoverageFieldset {}
</style>
