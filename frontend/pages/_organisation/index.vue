<template>
  <div class="LandingPage">
    <div class="MapBoxContainer">
      <welcome-box />
      <landing-map v-if="!showCoverImage" />
      <country-projects-box />

      <div
        v-if="showCoverImage"
        :style="{backgroundImage: `url(${landingData.cover_url})`}"
        class="CoverImageBg"
      />
    </div>

    <div v-if="$route.path.includes('-')" class="InfoSignupContainer">
      <el-row type="flex">
        <el-col class="InfoBoxWrapper">
          <info-box />
        </el-col>
        <el-col class="CentralBoxWrapper">
          <central-box />
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <!-- default -->
      <el-row type="flex" class="matrix-layout">
        <el-col :span="16">
          <div class="grid-content">
            <el-row :gutter="20">
              <el-col :span="24">
                <h3>Why use the Digital Health Atlas?</h3>
              </el-col>
              <el-col :span="8">
                <p>This web platform supports issuing unique IDs for curating the range of digital health products and projects globally.</p>
                <p>Governments and communities of technologists, implementers, and donors will be equipped to better coordinate and plan, monitor the</p>
              </el-col>
              <el-col :span="8">
                <p>growth of implementations, and reduce redundancy of investments.</p>
                <p>The Digital Health Atlas (DHA) offers governments, technologists, implementers, and donors a platform of tools and guidance to improve the use of, and planning coordination for digital information systems for health.</p>
              </el-col>
              <el-col :span="8">
                <p>The DHA facilitates implementers to assess the maturity of their digital health implementations, gain personalized guidance, benefit from other’s implementation experiences, and gain access to global resources from leading technical institutions.</p>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content img-center" :style="{backgroundImage: `url(${default1})`}" />
        </el-col>
      </el-row>

      <!-- just description -->
      <el-row :gutter="20" type="flex" class="matrix-layout pb-0">
        <el-col :span="16">
          <div class="grid-content">
            <p>The MOHS in close collaboration with the MIC established and launched the eHealth Coordination Hub, a national coordinating and regulating body that will support the advancement of eHealth in Sierra Leone.</p>
            <p>This Hub has adopted the DHA as an official tool to achieve its mandate of coordinating and regulating eHealth initiatives. Programs, Directorates, donors and implementers of digital health initiatives are requested to register their projects starting Monday 12th September, 2017.</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content img-center" :style="{backgroundImage: `url(${default2})`}" />
        </el-col>
      </el-row>

      <el-row :gutter="20" type="flex" class="matrix-layout">
        <el-col :span="8">
          <div class="grid-content img-center" :style="{backgroundImage: `url(${default1})`}" />
        </el-col>
        <el-col :span="16">
          <div class="grid-content">
            <el-row :gutter="20">
              <el-col :span="24">
                <h3>Why use the Digital Health Atlas?</h3>
              </el-col>
              <el-col :span="8">
                <p>This web platform supports issuing unique IDs for curating the range of digital health products and projects globally.</p>
                <p>Governments and communities of technologists, implementers, and donors will be equipped to better coordinate and plan, monitor the</p>
              </el-col>
              <el-col :span="8">
                <p>growth of implementations, and reduce redundancy of investments.</p>
                <p>The Digital Health Atlas (DHA) offers governments, technologists, implementers, and donors a platform of tools and guidance to improve the use of, and planning coordination for digital information systems for health.</p>
              </el-col>
              <el-col :span="8">
                <p>The DHA facilitates implementers to assess the maturity of their digital health implementations, gain personalized guidance, benefit from other’s implementation experiences, and gain access to global resources from leading technical institutions.</p>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>

      <!-- image -->
      <el-row :gutter="20" type="flex" class="matrix-layout">
        <el-col :span="14"><div class="grid-content"></div></el-col>
        <el-col :span="10"><div class="grid-content"></div></el-col>
      </el-row>

      <!-- image, description -->
      <!-- image, description, stats (complete or partial) -->
      <!-- image, description, documents -->
      <el-row :gutter="20" type="flex" class="matrix-layout">
        <el-col :span="16">
          <el-row>
            <el-col :span="24" class="mb"><div class="grid-content"></div></el-col>
            <el-col :span="24"><div class="grid-content"></div></el-col>
          </el-row>
        </el-col>
        <el-col :span="8"><div class="grid-content"></div></el-col>
      </el-row>

      <!-- description, image, stats (complete or partial), documents -->
      <!-- description, stats (complete or partial), documents -->
      <!-- image, stats (complete or partial), documents -->
      <!-- stats (complete or partial), documents -->
      <el-row :gutter="20" type="flex" class="matrix-layout">
        <el-col :span="8">
          <el-row>
            <el-col :span="24" class="mb"><div class="grid-content"></div></el-col>
            <el-col :span="24"><div class="grid-content"></div></el-col>
          </el-row>
        </el-col>
        <el-col :span="8"><div class="grid-content"></div></el-col>
        <el-col :span="8"><div class="grid-content"></div></el-col>
      </el-row>

      <!-- stats (complete or partial) -->
      <!-- documents -->
      <el-row :gutter="20" type="flex" class="matrix-layout">
        <el-col :span="16">
          <el-row>
            <el-col :span="24" class="mb"><div class="grid-content"></div></el-col>
            <el-col :span="24"><div class="grid-content"></div></el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
          </div>
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
import { mapGetters } from 'vuex';

// images
import default1 from '~/assets/img/default/default-1.jpg';
import default2 from '~/assets/img/default/default-2.jpg';

export default {
  components: {
    LandingMap,
    WelcomeBox,
    InfoBox,
    CentralBox,
    AboutSection,
    CountryProjectsBox
  },
  fetch ({ store }) {
    store.dispatch('landing/resetSearch');
  },
  data() {
    return {
      default1,
      default2
    }
  },
  computed: {
    ...mapGetters({
      landingData: 'landing/getLandingPageData'
    }),
    showCoverImage () {
      return this.landingData && this.landingData.cover;
    }
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

  .matrix-layout {
    &.pb-0 {
      padding-bottom: 0px!important;
    }
    &.el-row {
      padding: 40px;
      align-items: stretch;
      flex-wrap: wrap;
      .el-col {
        &.mb {
          margin-bottom: 20px;
        }
        overflow: hidden;
      }
    }
    .grid-content {
      background: #fff;
      min-height: 50px;
      height: 100%;
      padding: 40px;
      p {
        font-size: @fontSizeBase;
        line-height: 21px;
        color: @colorTextPrimary;
        margin: 0 0 20px;
      }
      h3 {
        color: @colorTextPrimary;
        margin: 0 0 20px;
      }
    }
    .img-center {
      background-position: center center;
    }
  }
</style>
