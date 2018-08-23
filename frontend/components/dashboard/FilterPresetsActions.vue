<template>
  <div class="FilterPresets">
    <el-row type="flex">
      <el-col :span="12">
        <el-popover
          placement="bottom-center"
          title="My filters presets"
          width="200"
          popper-class="AdvancedSearchPresetsDropdown"
          trigger="click"
        >
          <el-button
            slot="reference"
            type="text"
            class="IconRight"
          >
            Load filters
            <fa icon="caret-down" />
          </el-button>
          <div class="FilterList">
            <div>Filter One</div>
            <div>Filter Two</div>
          </div>
        </el-popover>
      </el-col>
      <el-col :span="6">
        <el-button
          type="text"
          size="small">
          Save
        </el-button>
      </el-col>
      <el-col :span="6">
        <el-button
          type="text"
          size="small"
          class="DeleteButton">
          Clear
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .FilterPresets {
    .el-col {
      // Selector
      &:nth-child(1) {
        width: 100%;
      }
      // Save
      &:nth-child(2) {
        width: auto;
        padding-left: 20px;
      }
      // Clear
      &:nth-child(3) {
        width: auto;
        padding-left: 20px;
      }
    }

    .el-button--text {
      padding: 0;
    }
  }
</style>
