<template>
  <div class="AboutSection">
    <el-row type="flex">
      <el-col class="AboutSectionLeft">
        <h4>About DHA</h4>
        <p>{{ $store.state.system.landing_page_defaults.permanent_footer }}</p>
      </el-col>
      <el-col class="AboutSectionRight">
        <h4>Global Support to DHA</h4>
        <div class="SupporterLogos">
          <div class="Partner">
            <img
              src="/static/partners/who-logo.png"
              alt="WHO">
          </div>
          <div class="Partner">
            <img
              src="static/partners/logo-hrp-new-cropped.png"
              alt="HRP">
          </div>
          <div class="Partner">
            <img
              src="/static/partners/logo-path-color.png"
              alt="PATH">
          </div>
          <div class="Partner">
            <img
              src="/static/partners/logo-digital_square.png"
              alt="Digital Square">
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .AboutSection {
    .limitPageWidth();
    background-color: @colorWhite;

    > .el-row {
      align-items: stretch;
    }

    h4 {
      color: @colorTextPrimary;
      margin: 0 0 20px;
    }

    p {
      font-size: @fontSizeSmall;
      line-height: 18px;
      color: @colorTextPrimary;
    }

    .AboutSectionLeft {
      min-width: 360px;
      max-width: 360px;
      margin-right: 30px;
      padding: 40px;
    }

    .AboutSectionRight {
      padding: 40px 30px;

      .SupporterLogos {
        .clearfix();

        .Partner {
          float: left;
          margin: 20px 80px 40px 0;

          img {
            width: auto;
            height: 60px;
          }
        }
      }
    }
  }
</style>
