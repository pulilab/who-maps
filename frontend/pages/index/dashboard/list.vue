<template>
  <div class="DashboardListView">
    <el-row>
      <table-top-actions />
    </el-row>
    <el-row>
      <main-table />
    </el-row>
  </div>
</template>

<script>
import MainTable from '../../../components/dashboard/MainTable';
import TableTopActions from '../../../components/dashboard/TableTopActions';

export default {
  components: {
    MainTable,
    TableTopActions
  }
};
</script>

<style>

</style>
