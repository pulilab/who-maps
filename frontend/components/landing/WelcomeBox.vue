<template>
  <div class="WelcomeBox-holder">
    <div
      v-show="visible"
      class="WelcomeBox">

      <h2>Welcome!</h2>
      <h6>{{ $store.state.system.landing_page_defaults.cover_text }}</h6>

      <el-button
        icon="el-icon-close"
        circle
        class="CloseWelcomeBox"
        @click="closeWelcomeBox" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: true
    };
  },
  methods: {
    closeWelcomeBox () {
      this.visible = false;
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .WelcomeBox-holder {
    .WelcomeBox {
      z-index: 400;
      position: absolute;
      bottom: 40px;
      left: 40px;
      box-sizing: border-box;
      width: 360px;
      height: auto;
      max-height: 420px;
      padding: 20px 40px;
      color: @colorWhite;
      background: fade(@colorBrandPrimary, 90%);
      box-shadow: 5px 5px 20px 0 rgba(0,0,0,0.12);

      h2 {
        font-size: @fontSizeHeading;
        margin: 20px 0;
      }

      h6 {
        line-height: 24px;
        font-weight: 400;
        margin: 10px 0 15px;
      }

      .CloseWelcomeBox {
        position: absolute;
        top: 16px;
        right: 16px;
      }
    }
  }
</style>
