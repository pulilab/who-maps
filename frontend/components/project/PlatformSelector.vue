<template>
  <el-select
    :value="platform"
    popper-class="PlatformSelectorDropdown"
    class="PlatformSelector"
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
  props: {
    index: {
      type: Number,
      default: 0
    },
    platforms: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters({
      technologyPlatforms: 'projects/getTechnologyPlatforms'
    }),
    platform () {
      return this.platforms[this.index];
    },
    availablePlatforms () {
      return this.technologyPlatforms.filter(tp => !this.platforms.some(s => s === tp.id) || tp.id === this.platform);
    }
  },
  methods: {
    changeHandler (value) {
      const p = [...this.platforms];
      p[this.index] = value;
      this.$emit('update:platforms', p);
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .PlatformSelector {
    width: 100%;
  }

  .PlatformSelectorDropdown {}
</style>
