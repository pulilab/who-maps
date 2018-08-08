<template>
  <div class="WelcomeBox-holder">
    <transition name="el-zoom-in-top">
      <div
        v-show="showWelcomeBox"
        class="WelcomeBox">

        <h2>Welcome!</h2>
        <h6>{{ landingPageDefaults.cover_text }}</h6>

        <el-button
          circle
          class="CloseWelcomeBox"
          @click="closeWelcomeBox"
        >
          <fa icon="times" />
        </el-button>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data () {
    return {
      visible: true
    };
  },
  computed: {
    ...mapGetters({
      landingPageDefaults: 'system/getLandingPageDefaults',
      activeCountry: 'landing/getActiveCountry'
    }),
    showWelcomeBox () {
      return this.visible && !this.activeCountry;
    }
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
      box-shadow: 5px 5px 20px 0 rgba(0,0,0,0.15);

      h2 {
        margin: 20px 0;
      }

      h6 {
        margin: 10px 0 20px;
      }

      .CloseWelcomeBox {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 40px;
        height: 40px;
      }
    }
  }
</style>
