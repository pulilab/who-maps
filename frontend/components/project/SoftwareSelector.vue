<template>
  <lazy-el-select
    :value="value"
    :placeholder="$gettext('Select from list')"
    multiple
    filterable
    popper-class="PlatformSelectorDropdown"
    class="SoftwareBucketSelector"
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
      v-for="software in availablePlatforms"
      :key="software.id"
      :label="software.name"
      :value="software.id"
      :class="`${software.state === 2 ? 'requested' : ''}`"
    >
      <template v-if="software.state === 1">
        {{ software.name }}
      </template>
      <template v-if="software.state === 2">
        <span class="left">
          <b>{{ software.name }}</b>
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
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Array,
      default: null
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
      softwares: 'projects/getTechnologyPlatforms'
    })
  },
  methods: {
    ...mapActions({
      setNewSoftware: 'projects/setNewSoftware'
    }),
    async changeHandler (value) {
      console.log('🚀 ~ file: SoftwareSelector.vue:86 ~ changeHandler ~ value:', value)
      let id = value
      if (typeof id === 'string') {
        const newSoftware = await this.setNewSoftware(value)
        id = typeof newSoftware === 'number' ? newSoftware : 0
      }
      const p = [...this.platforms]
      p[this.index] = id
      this.$emit('change', p)
    },
    filter(value) {
      this.availablePlatforms = this.softwares.filter(platform =>
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

<style lang="less">
@import "../../assets/style/variables.less";
@import "../../assets/style/mixins.less";

.SoftwareBucketSelector {
  width: 100%;
}

.el-select-dropdown__item {
  position: relative;
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
