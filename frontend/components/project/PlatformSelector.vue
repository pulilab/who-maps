<template>
  <lazy-el-select
    :value="platform"
    :placeholder="$gettext('Select from list') | translate"
    popper-class="PlatformSelectorDropdown"
    class="PlatformSelector"
    value-key="id"
    filterable
    multiple
    :filter-method="filter"
    @change="changeHandler"
    @blur="$emit('blur')"
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
      v-for="item in availablePlatforms"
      :key="item.id"
      :label="item.name"
      :value="item.id"
      :class="`${item.state === 2 ? 'requested' : ''}`"
    >
      <template v-if="item.state === 1">
        {{ item.name }}
      </template>
      <template v-if="item.state === 2">
        <span class="left">
          <b>{{ item.name }}</b>
        </span>
        <span class="right">
          <small>
            <fa icon="exclamation-triangle" />
            <translate>Requested, please wait for approval</translate>
          </small>
        </span>
      </template>
    </el-option>
  </lazy-el-select>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  model: {
    prop: 'platforms',
    event: 'change'
  },
  $_veeValidate: {
    value () {
      return this.platform
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
  data () {
    return {
      newPlatform: null,
      availablePlatforms: []
    }
  },
  computed: {
    ...mapGetters({
      technologyPlatforms: 'projects/getTechnologyPlatforms'
    }),
    platform () {
      return this.platforms[this.index]
    }
  },
  mounted () {
    this.availablePlatforms = this.technologyPlatforms.filter(
      tp => !this.platforms.some(s => s === tp.id) || tp.id === this.platform
    ).sort((a, b) => a.name.localeCompare(b.name))
  },
  methods: {
    ...mapActions({
      setNewSoftware: 'projects/setNewSoftware'
    }),
    async changeHandler (value) {
      let id = value
      if (typeof id === 'string') {
        const newSoftware = await this.setNewSoftware(value)
        id = typeof newSoftware === 'number' ? newSoftware : 0
      }
      const p = [...this.platforms]
      p[this.index] = id
      this.$emit('change', p)
    },
    filter (value) {
      this.availablePlatforms = this.technologyPlatforms.filter(platform =>
        platform.name.toLowerCase().includes(value.toLowerCase())
      )
      if (value) {
        this.newPlatform = { id: value, name: value }
      } else {
        this.newPlatform = null
      }
    }
  }
}
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
