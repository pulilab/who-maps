<template>
  <lazy-el-select
    :value="value"
    :placeholder="$gettext('Select from list') | translate"
    filterable
    multiple
    class="SatSelect"
    popper-class="sat-popper"
    @change="changeHandler"
  >
    <el-option-group
      v-for="group in applicationTypes"
      :key="group.id"
      :label="group.name"
    >
      <el-option
        v-for="service in group.services"
        :key="service.id"
        :value="service.id"
        :label="service.name"
        class="sat-item"
      >
        <span>{{service.name}}</span>
        <el-tooltip class="item" effect="light" content="Top Left prompts info" popper-class="select-tip">
          <div slot="content" v-html="service.description" />
          <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        </el-tooltip>
      </el-option>
      <el-tooltip class="item" effect="light" content="Top Left prompts info" popper-class="select-tip">
        <div slot="content" v-html="group.description" />
        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="group">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      </el-tooltip>
    </el-option-group>
  </lazy-el-select>
</template>

<script>
import { mapGetters } from 'vuex'

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
      applicationTypes: 'projects/getApplicationTypes'
    })
  },
  methods: {
    changeHandler (value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";

.SatSelect {
  width: 100%;
  ::v-deep .el-select-group {
    position: relative;
  }
}

.sat-popper {
  .el-select-group {
    position: relative;
    svg.group {
      position: absolute;
      top: 5px;
      right: 20px;
      height: 20px;
      width: 20px;
      color: @colorGray;
      width: 20px;
      height: 20px;
      &:hover {
        color: @colorBrandPrimary;
      }
    }
  }
}

.sat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  svg {
    cursor: default;
    color: @colorGray;
    width: 20px;
    height: 20px;
    &:hover {
      color: @colorBrandPrimary;
    }
  }
  &.el-select-dropdown__item.selected {
    &::after {
      right: 48px;
    }
  }
}
</style>
