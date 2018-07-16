<template>
  <div class="LandingPage">
    <top-bar />
    <!-- <top-bar
      country-specific
      country-logo-url="/placeholder-sl.png" /> For countries -->
    <action-bar />

    <div class="MapBoxContainer">
      <landing-map />
      <welcome-box />
    </div>

    <div class="InfoSignupContainer">
      <info-box />
      <signup-box />
    </div>

    <about-section />
  </div>
</template>

<script>
import TopBar from '../../components/common/TopBar.vue';
import ActionBar from '../../components/common/ActionBar.vue';

import LandingMap from '../../components/landing/LandingMap.vue';
import WelcomeBox from '../../components/landing/WelcomeBox.vue';
import InfoBox from '../../components/landing/InfoBox.vue';
import SignupBox from '../../components/landing/SignupBox.vue';
import AboutSection from '../../components/landing/AboutSection.vue';

export default {
  components: {
    TopBar,
    ActionBar,
    LandingMap,
    WelcomeBox,
    InfoBox,
    SignupBox,
    AboutSection
  }
};
</script>

<style lang="less">
.LandingPage {
  .MapBoxContainer {
    position: relative;

    .WelcomeBox {
      position: absolute;
      bottom: 0;
      z-index: 400;
    }
  }
  .InfoSignupContainer {
    height: 500px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

</style>
