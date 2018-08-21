<template>
  <el-row>
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
        >
          Load filters
          <fa icon="arrow-down" />
        </el-button>
        <div class="FilterList">
          <div>Filter One</div>
          <div>Filter Two</div>
        </div>
      </el-popover>
    </el-col>
    <el-col :span="6">
      <el-button type="text">
        Save
      </el-button>
    </el-col>
    <el-col :span="6">
      <el-button type="text">
        Clear
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {

};
</script>

<style>

</style>
