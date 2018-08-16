<template>
  <div class="SubLevelItem">
    <el-row>
      <simple-field
        :header="levelName"
        :content="subLevel.name"
      />
    </el-row>
    <el-row>
      <coverage-field :coverage="localCoverageData" />
    </el-row>
  </div>
</template>

<script>

import SimpleField from './SimpleField';
import CoverageField from './CoverageField';

export default {
  components: {
    SimpleField,
    CoverageField
  },
  props: {
    levelName: {
      type: String,
      required: true
    },
    subLevels: {
      type: Array,
      default: () => []
    },
    coverage: {
      type: [String, Number],
      default: null
    },
    coverageData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    subLevel () {
      return this.subLevels.find(s => s.id === this.coverage);
    },
    localCoverageData () {
      return this.coverageData[this.coverage];
    }
  }
};
</script>

<style lang="less">
.SubLevelItem {
  width: 100%;
}
.SubLevelItemDropdown {

}
</style>
