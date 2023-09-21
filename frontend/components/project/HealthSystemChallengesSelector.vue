<template>
  <lazy-el-select
    :value="value"
    :placeholder="$gettext('Select from list') | translate"
    multiple
    filterable
    popper-class="hsc-popper"
    class="HealthSystemChallengesSelector"
    @change="changeHandler"
  >
    <el-option-group
      v-for="group in healthSystemChallenges"
      :key="group.id"
      :label="group.name"
    >
      <el-option
        v-for="hsc in group.challenges"
        :key="hsc.id"
        :value="hsc.id"
        :label="hsc.challenge"
        class="hsc-item"
      >
        <span>{{ hsc.challenge }}</span>
        <el-tooltip
          v-show="hsc.description"
          effect="dark"
          placement="left"
          :content="hsc.description"
          popper-class="hsc-tooltip"
          class="item"
        >
          <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        </el-tooltip>
      </el-option>
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
      healthSystemChallenges: 'projects/getHscChallenges'
    })
  },
  methods: {
    changeHandler (value) {
      this.$emit('change', value)
    },
  }
}
</script>

<style lang="less">
@import "~assets/style/variables.less";

.HealthSystemChallengesSelector {
  width: 100%;
  ::v-deep .el-select-group {
    position: relative;
  }
}

.hsc-tooltip {
  max-width: 448px;
  white-space: break-spaces;
}

.hsc-popper {
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

.hsc-item {
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
