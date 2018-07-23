<template>
  <div class="ActionBar">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      class="InnerActionBar">
      <el-col class="Title">
        <h3>Digital Health Atlas</h3>
      </el-col>
      <el-col class="SearchComponent">
        <search-component />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SearchComponent from '../common/SearchComponent.vue';

export default {
  components: {
    SearchComponent
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .ActionBar {
    background-color: @colorBrandPrimary;

    .InnerActionBar {
      .limitPageWidth();
      height: 48px;
    }

    .Title {
      h3 {
        margin: 0;
        font-size: @fontSizeLarge;
        color: @colorWhite;
      }
    }

    .SearchComponent {
      width: auto;
    }
  }
</style>
