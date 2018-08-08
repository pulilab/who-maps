<template>
  <el-select
    :value="value"
    multiple
    filterable
    popper-class="HisBucketSelectorSelectorDropdown"
    class="HisBucketSelector"
    placeholder="Select from list"
    @change="changeHandler">

    <el-option
      v-for="his in hisBucket"
      :key="his.id"
      :label="his.name"
      :value="his.id"/>
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
      type: Array,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      hisBucket: 'projects/getHisBucket'
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
.HisBucketSelector {
  width: 100%;
}
.HisBucketSelectorSelectorDropdown {

}
</style>
