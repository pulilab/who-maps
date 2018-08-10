<template>
  <el-select
    v-if="facilities.length > 0"
    :value="value"
    :remote-method="search"
    :loading="loading"
    :disabled="disabled"
    multiple
    filterable
    remote
    class="FacilitySelector"
    popper-class="FacilitySelectorDropdown"
    placeholder="Type and select a name"
    @change="changeHandler"
  >
    <el-option
      v-for="facility in result"
      :key="facility.name"
      :label="facility.name"
      :value="facility.name"
    />
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {},
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
    changeHandler (value) {
      this.$emit('change', value);
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
