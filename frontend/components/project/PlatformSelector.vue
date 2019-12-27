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
      <span class="left">
        <b>{{ newPlatform.name }}</b>
      </span>
      <span class="left">
        <small>
          <translate>DHA Admin will update the Software list to include your new software name</translate>
        </small>
      </span>
      <span class="right">
        <b>
          <fa icon="plus-circle" />
          <translate>Add as new</translate>
        </b>
      </span>
    </el-option>
    <el-option
      v-for="platform in availablePlatformsFilter"
      :key="platform.id"
      :label="platform.name"
      :value="platform.id"
      :class="`${platform.new ? 'requested' : ''}`"
    >
      <template v-if="platform.new">
        <span class="left">
          <b>{{ platform.name }}</b>
        </span>
        <span class="right">
          <small>
            <fa icon="exclamation-triangle" />
            <translate>Requested, please wait for approval</translate>
          </small>
        </span>
      </template>
      <template v-else>{{ platform.name }}</template>
    </el-option>
  </lazy-el-select>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  model: {
    prop: "platforms",
    event: "change"
  },
  $_veeValidate: {
    value() {
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
    };
  },
  mounted() {
    const available = this.technologyPlatforms.filter(
      tp => !this.platforms.some(s => s === tp.id) || tp.id === this.platform
    );
    const newAvailablePlatforms = this.platforms.map(p => {
      if (typeof p === "string") {
        return { id: p, name: p, new: true };
      }
    }).filter(val => typeof val !== 'undefined');

    this.availablePlatforms = [
      ...newAvailablePlatforms,
      ...available
    ].sort((a, b) => a.name.localeCompare(b.name));
    this.availablePlatformsFilter = this.availablePlatforms;
  },
  computed: {
    ...mapGetters({
      technologyPlatforms: "projects/getTechnologyPlatforms"
    }),
    platform() {
      return this.platforms[this.index];
    }
  },
  methods: {
    changeHandler(value) {
      const p = [...this.platforms];
      p[this.index] = value;
      this.$emit("change", p);
    },
    filter(value) {
      this.availablePlatformsFilter = this.availablePlatforms.filter(platform =>
        platform.name.toLowerCase().includes(value.toLowerCase())
      );
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
  &.requested {
    background-color: #fffbdd;
    .left {
      float: left;
      width: 60%;
      overflow: hidden;
    }
    .right {
      float: right;
      overflow: hidden;
      color: @colorTextMuted;
      font-size: 10px;
      margin-top: 0px;
      svg {
        color: #f8a72a;
        margin-right: 6px;
      }
    }
  }
  &.new {
    background-color: #fff8c4;
    padding-top: 5px;
    height: 58px;
    .left {
      float: left;
      width: 70%;
      height: 16px;
    }
    .right {
      float: right;
      // width: 25%;
      color: @colorBrandPrimary;
      font-size: 13px;
      margin-top: -7px;
      svg {
        margin-right: 10px;
      }
    }
  }
}
</style>
