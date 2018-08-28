<template>
  <el-select
    :value="value"
    placeholder="Select region"
    @change="changeHandler">
    <el-option
      v-for="region in regions"
      :key="region.id"
      :label="region.name"
      :value="region.id"/>
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
      regions: 'countries/getRegions'
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
