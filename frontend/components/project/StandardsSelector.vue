<template>
  <el-checkbox-group
    :value="value"
    @input="changeHandler">
    <el-checkbox
      v-for="standard in standards"
      :key="standard.id"
      :label="standard.id">
      {{ standard.name }}
    </el-checkbox>
  </el-checkbox-group>
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
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters({
      standards: 'projects/getInteroperabilityStandards'
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
