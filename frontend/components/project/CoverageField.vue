<template>
  <div class="CoverageField">
    <el-row>
      <el-col :span="8">
        <simple-field
          :content="coverage.health_workers"
          header="# Health Workers" />
      </el-col>
      <el-col :span="8">
        <simple-field
          :content="coverage.facilities"
          header="# Facilities" />
      </el-col>
      <el-col :span="8">
        <simple-field
          :content="coverage.clients"
          header="# Clients" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SimpleField from './SimpleField';
export default {
  components: {
    SimpleField
  },
  props: {
    coverage: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style>

</style>
