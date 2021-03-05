<template>
  <el-table
    :data="data"
    :default-sort="{ prop: 'country', order: 'ascending' }"
    height="370"
    size="small"
    class="table-custom"
  >
    <el-table-column type="index" :index="handleIndex"> </el-table-column>
    <el-table-column prop="country" label="Country" sortable width="130">
      <template slot-scope="scope">
        <div class="custom-column">
          <img :src="scope.row.img" :alt="scope.row.country" />
          <b>{{ scope.row.country }}</b>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="no" label="No" sortable width="62" />
    <el-table-column prop="pending" label="Pending" sortable />
    <el-table-column prop="yes" label="Yes" sortable />
  </el-table>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  methods: {
    handleIndex(index) {
      return "";
    },
  },
};
</script>

<style lang="scss" scoped>
.table-custom {
  width: 100%;
  margin-top: 15px;
  // padding: 0 30px;
}
.custom-column {
  display: flex;
  align-items: center;
  img {
    width: 24px;
    height: 16px;
    margin-right: 10px;
  }
  b {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
