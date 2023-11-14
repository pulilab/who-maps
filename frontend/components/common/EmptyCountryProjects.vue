<template>
  <div class="EmptyProjectList">
    <el-row type="flex">
      <el-col>
        <div class="SquareWrapper">
          <img src="~assets/img/empty_countrys.png">
        </div>
      </el-col>
    </el-row>
    <el-row type="flex">
      <el-col>
        <translate tag="p">There are no projects in your country.</translate>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less"scoped>
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .EmptyProjectList {
    text-align: center;

    img {
      max-width: 500px;
    }

    p {
      margin: 20px 0 60px;
      font-size: @fontSizeSmall;
      line-height: 18px;
      // font-weight: 700;
      color: @colorTextSecondary;
    }
  }

</style>
