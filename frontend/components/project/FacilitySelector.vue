<template>
  <el-form-item
    v-if="facilities.length > 0"
    :error="errors.first('facilities_list')"
    label="Facilities">
    <el-select
      v-validate="rules.facilities_list"
      v-model="innerValue"
      :remote-method="search"
      :loading="loading"
      :disabled="disabled"
      data-vv-name="facilities_list"
      data-vv-as="Facilitiy list"
      multiple
      filterable
      remote
      class="FacilitySelector"
      popper-class="FacilitySelectorDropdown"
      placeholder="Type and select a name"
    >
      <el-option
        v-for="facility in result"
        :key="facility.name"
        :label="facility.name"
        :value="facility.name"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { mapGetters } from 'vuex';
import VeeValidationMixin from '../mixins/VeeValidationMixin.js';

export default {
  components: {},
  mixins: [VeeValidationMixin],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Array,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      result: []
    };
  },
  computed: {
    ...mapGetters({
      country: 'project/getCountry',
      getFacilities: 'countries/getCountryFacilityList'
    }),
    facilities () {
      return this.getFacilities(this.country);
    },
    innerValue: {
      get () {
        return this.value;
      },
      set (value) {
        this.$emit('change', value);
      }
    }
  },
  methods: {
    search (query) {
      if (query) {
        this.loading = true;
        this.result = this.facilities.filter(f => f.name.toLowerCase().startsWith(query.toLowerCase())).slice(0, 100);
        this.loading = false;
      }
    },
    async validate () {
      return this.$validator.validateAll();
    }
  }
};
</script>

<style lang="less">
.FacilitySelector {
  width: 100%;
}
.FacilitySelectorDropdown {
   .OrganisationItem {
    display: inline;
  }
}
</style>
