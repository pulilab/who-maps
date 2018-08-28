<template>
  <el-select
    :value="value"
    :popper-class="popperAdditionalClass"
    placeholder="Select country"
    @change="changeHandler">
    <el-option
      v-for="country in countries"
      :key="country.id"
      :label="country.name"
      :value="country.id"/>
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Number,
      default: null
    },
    popperAdditionalClass: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      countries: 'countries/getCountries'
    })
  },
  methods: {
    changeHandler (value) {
      this.$emit('change', value);
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .CountrySelectPopper {
    max-width: @advancedSearchWidth - 40px;
  }
</style>
