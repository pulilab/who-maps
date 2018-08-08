<template>
  <div class="SingupBox">
    <el-row
      type="flex"
      align="middle"
      class="SignupBoxHeadline">
      <el-col>
        <h2>Sign up</h2>
        <h6>
          Whether you are an implementer, government, or financial investor,<br>
          or technologist, sign up below.
        </h6>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <signup-component shadow="never"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SignupComponent from '../SignupComponent';

export default {
  components: {
    SignupComponent
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .SingupBox {
    height: 172px;
    text-align: center;
    background-color: @colorWhite;

    .SignupBoxHeadline {
      position: relative;
      height: 100%;

      &::after {
        content: "";
        z-index: 100;
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        display: block;
        width: 0;
        height: 0;
        border-left: 36px solid transparent;
        border-right: 36px solid transparent;
        border-top: 36px solid @colorWhite;
      }

      h2 {
        color: @colorBrandPrimary;
        margin: 0 0 20px;
      }

      h6 {
        color: @colorTextPrimary;
        margin: 0;
      }
    }

    .SingupComponent {
      .el-card__header,
      .FieldsetLegend,
      .LoginLink {
        display: none;
      }

      .el-card {
        border: 0;
        border-radius: 0;
        box-shadow: none !important;

        .el-card__body {
          background-color: @colorBrandPrimary;
        }

        .el-form {
          fieldset {
            padding: 0;
          }

          .el-form-item__label {
            color: @colorWhite;
          }
        }

        .CardActionsBottom {
          padding: 30px 0 0;
          border: 0;
          background-color: transparent;

          .el-row {
            justify-content: center;
          }

          .secondaryAction {
            display: none;
          }
        }
      }
    }
  }
</style>
