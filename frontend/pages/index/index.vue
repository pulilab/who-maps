<template>
  <div class="LandingPage">
    <top-bar />
    <action-bar />
    <landing-map />
    <welcome-box />
    <info-box />
    <about-section />
    <signup-box />
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

<style>

</style>
