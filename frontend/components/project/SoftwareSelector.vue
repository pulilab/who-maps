<template>
  <el-select
    :value="value"
    popper-class="SoftwareSelectorDropdown"
    class="SoftwareSelector"
    value-key="id"
    placeholder="Select from list"
    @change="changeHandler">

    <el-option
      v-for="paltform in availablePlatforms"
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
    },
    selected: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters({
      technologyPlatforms: 'projects/getTechnologyPlatforms'
    }),
    availablePlatforms () {
      return this.technologyPlatforms.filter(tp => !this.selected.some(s => s.id === tp.id) || tp.id === this.value);
    }
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
