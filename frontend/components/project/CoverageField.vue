<template>
  <div class="CoverageField">
    <el-row>
      <el-col :span="8">
        <simple-field
          :content="cov.health_workers"
          header="# Health Workers" />
      </el-col>
      <el-col :span="8">
        <simple-field
          :content="cov.facilities"
          header="# Facilities" />
      </el-col>
      <el-col :span="8">
        <simple-field
          :content="cov.clients"
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
  },
  computed: {
    cov () {
      return this.coverage || {};
    }
  }
};
</script>

<style>

</style>
