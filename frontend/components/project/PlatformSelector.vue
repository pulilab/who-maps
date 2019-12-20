<template>
  <lazy-el-select
    :value="platform"
    :placeholder="$gettext('Select from list') | translate"
    popper-class="PlatformSelectorDropdown"
    class="PlatformSelector"
    value-key="id"
    filterable
    @change="changeHandler"
    @blur="$emit('blur')"
    :filter-method="filter"
  >
    <el-option
      v-if="newPlatform"
      :key="newPlatform.id"
      :label="newPlatform.name"
      :value="newPlatform.id"
      class="new"
    >
      <span class="left"><b>{{ newPlatform.id }}</b></span>
      <span class="left">
        <small>
          <translate>
            DHA Admin will update the Software list to include your new software name
          </translate>
        </small>
      </span>
      <span class="right"><b><fa icon="chevron-right" /><translate>Add as new</translate></b></span>
    </el-option>
    <el-option
      v-for="platform in availablePlatformsFilter"
      :key="platform.id"
      :label="platform.name"
      :value="platform.id"
    />

  </lazy-el-select>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  model: {
    prop: 'platforms',
    event: 'change'
  },
  $_veeValidate: {
    value () {
      return this.platform;
    }
  },
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
  data() {
    return {
      newPlatform: null,
      availablePlatforms: [],
      availablePlatformsFilter: []
    }
  },
  mounted() {
    this.availablePlatforms = this.technologyPlatforms.filter(tp => !this.platforms.some(s => s === tp.id) || tp.id === this.platform)
    this.availablePlatformsFilter = this.technologyPlatforms.filter(tp => !this.platforms.some(s => s === tp.id) || tp.id === this.platform)
  },
  computed: {
    ...mapGetters({
      technologyPlatforms: 'projects/getTechnologyPlatforms'
    }),
    platform () {
      return this.platforms[this.index];
    }
  },
  methods: {
    changeHandler (value) {
      const p = [...this.platforms];
      p[this.index] = value;
      console.log(p);
      this.$emit('change', p);
    },
    filter (value) {
      this.availablePlatformsFilter = this.availablePlatforms.filter(platform => platform.name.toLowerCase().includes(value.toLowerCase()))
      if (value) {
        this.newPlatform = { id: value, name: value };
      } else {
        this.newPlatform = null;
      }
    }
  }
};
</script>

<style lang="less" scoped>
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .PlatformSelector {
    width: 100%;
  }

  .el-select-dropdown__item {
    &.new {
      background-color: #FFF8C4;
      padding-top: 5px;
      height: 58px;
      .left {
        float: left;
        width: 70%;
        height: 16px;
      }
      .right {
        float: right;
        width: 25%;
        color: @colorBrandPrimary;
        font-size: 13px;
      }
    }
  }

</style>
