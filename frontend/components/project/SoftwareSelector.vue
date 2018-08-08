<template>
  <el-select
    :value="value"
    popper-class="SoftwareSelectorDropdown"
    class="SoftwareSelector"
    placeholder="Select from list"
    @change="changeHandler">

    <el-option
      v-for="paltform in technologyPlatforms"
      :key="paltform.id"
      :label="paltform.name"
      :value="paltform.id"/>
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
      technologyPlatforms: 'projects/getTechnologyPlatforms'
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
.SoftwareSelector {
  width: 50%;
}
.SoftwareSelectorDropdown {

}
</style>
