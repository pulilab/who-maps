<template>
  <el-select
    :value="value"
    placeholder="Select from list"
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

<style>

</style>
