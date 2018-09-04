<template>
  <el-select
    :value="value"
    popper-class="DonorSelectorPopper"
    class="DonorSelector"
    placeholder="Select donor"
    @change="changeHandler">
    <el-option
      v-for="donor in donors"
      :key="donor.id"
      :label="donor.name"
      :value="donor.id"/>
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
      donors: 'user/getDonors'
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

  .DonorSelectorPopper {
    max-width: @advancedSearchWidth - 40px;
  }
</style>
