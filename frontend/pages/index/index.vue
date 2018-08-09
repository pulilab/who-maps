<template>
  <div class="LandingPage">
    <div class="MapBoxContainer">
      <landing-map />
      <welcome-box />
      <country-projects-box />
    </div>

    <div class="InfoSignupContainer">
      <el-row type="flex">
        <el-col class="InfoBoxWrapper">
          <info-box />
        </el-col>
        <el-col class="CentralBoxWrapper">
          <central-box />
        </el-col>
      </el-row>
    </div>

    <about-section />
  </div>
</template>

<script>

import LandingMap from '../../components/landing/LandingMap.vue';
import WelcomeBox from '../../components/landing/WelcomeBox.vue';
import CountryProjectsBox from '../../components/landing/CountryProjectsBox.vue';
import InfoBox from '../../components/landing/InfoBox.vue';
import CentralBox from '../../components/landing/CentralBox.vue';
import AboutSection from '../../components/landing/AboutSection.vue';

export default {
  components: {
    LandingMap,
    WelcomeBox,
    InfoBox,
    CentralBox,
    AboutSection,
    CountryProjectsBox
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .LandingPage {

    .MapBoxContainer {
      position: relative;
    }

    .InfoSignupContainer {
      margin: 40px 0;

      > .el-row {
        align-items: stretch;
      }

      .InfoBoxWrapper {
        min-width: 360px;
        max-width: 360px;
        margin-left: 40px;
        margin-right: 30px;
        background-color: @colorWhite;
      }

      .CentralBoxWrapper {
        margin-right: 40px;
        background-color: @colorBrandPrimary;
      }

      // .InfoBox {}

      .SignupBox {
        padding: 0 40px;
      }
    }

    h2 {
      font-size: @fontSizeHeading;
    }

    h3 {
      font-size: @fontSizeTitle;
    }

    h4 {
      font-size: @fontSizeLarge;
    }

    h6 {
      font-size: @fontSizeMedium;
      line-height: 24px;
      font-weight: 400;
    }
  }
</style>
