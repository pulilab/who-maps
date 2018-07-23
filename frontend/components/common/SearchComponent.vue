<template>
  <div class="SearchDropdown">
    <i class="el-icon-search" />
  </div>
</template>

<script>
export default {

};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .SearchDropdown {
    padding: 0 10px;

    .el-icon-search {
      font-size: 24px;
      font-weight: 700;
      color: @colorWhite;
    }
  }
</style>
