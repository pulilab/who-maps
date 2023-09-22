<template>
  <div class="LandingPage">
    <div class="MapBoxContainer">
      <WelcomeBox />
      <template v-if="routeCheck">
        <LandingMap v-if="!showCoverImage" />
        <CountryProjectsBox />
        <div
          v-if="showCoverImage"
          :style="{backgroundImage: `url(${landingData.cover_url})`}"
          class="CoverImageBg"
        />
      </template>
      <template v-else>
        <LandingMap />
        <CountryProjectsBox />
      </template>
    </div>
    <div>
      <!--hide temporarly-->
      <el-row type="flex" v-if="false">
        <el-col>
          <Banner />
        </el-col>
      </el-row>
      <!-- <el-row type="flex">
        <el-col>
          <StoryBox />
        </el-col>
      </el-row> -->
      <el-row type="flex">
        <el-col>
          <IntroVideo />
        </el-col>
      </el-row>
    </div>
    <div v-if="!landingData" class="InfoSignupContainer">
      <el-row type="flex">
        <el-col class="InfoBoxWrapper">
          <InfoBox />
        </el-col>
        <el-col class="CentralBoxWrapper">
          <CentralBox />
        </el-col>
      </el-row>
    </div>
    <LayoutBuilder v-else :data="defaultsLandingData" />
    <KpiBox />
    <AboutSection />
  </div>
</template>

<script>
import LandingMap from '@/components/landing/LandingMap.vue'
import WelcomeBox from '@/components/landing/WelcomeBox.vue'
import CountryProjectsBox from '@/components/landing/CountryProjectsBox.vue'
import Banner from '@/components/landing/Banner.vue'
import StoryBox from '@/components/landing/StoryBox.vue'
import IntroVideo from '@/components/landing/IntroVideo.vue'
import InfoBox from '@/components/landing/InfoBox.vue'
import CentralBox from '@/components/landing/CentralBox.vue'
import AboutSection from '@/components/landing/AboutSection.vue'
import KpiBox from '@/components/landing/KpiBox.vue'
import LayoutBuilder from '@/components/country/LayoutBuilder'

import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Organisation',
  components: {
    LandingMap,
    WelcomeBox,
    Banner,
    StoryBox,
    IntroVideo,
    InfoBox,
    CentralBox,
    AboutSection,
    CountryProjectsBox,
    LayoutBuilder,
    KpiBox
  },
  fetch({ store }) {
    store.dispatch('landing/resetSearch')
  },
  computed: {
    ...mapGetters({
      landingData: 'landing/getLandingPageData'
    }),
    showCoverImage() {
      return false
    },
    routeCheck() {
      return this.$route.path.split('/')[2].trim() === '-' || this.$route.path.split('/')[2].trim().length > 2
    },
    defaultsLandingData() {
      return {
        gdhi_enabled: false,
        road_map_enabled: false,
        documents: [],
        ...(this.landingData || {})
      }
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/variables.less';
@import '../../assets/style/mixins.less';

.LandingPage {
  .MapBoxContainer {
    position: relative;
  }

  .CoverImageBg {
    display: block;
    height: @landingMapHeight;
    min-height: @landingMapMinHeight;
    background-color: @colorGrayLight;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .CoverImage {
    width: 100%;
    height: auto;
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

    .SignupBox {
      padding: 0 40px;
    }

    .SingupComponent {
      min-height: auto !important;
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
