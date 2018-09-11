<template>
  <div class="AboutSection">
    <el-row type="flex">
      <el-col class="AboutSectionLeft">
        <h4>{{ title }}</h4>
        <p>{{ permanentFooterText }}</p>
        <p v-show="countryText" >{{ countryText }}</p>
      </el-col>
      <el-col class="AboutSectionRight">
        <div class="WhoSupporter">
          <h4><translate>Global Support to DHA</translate></h4>
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
        </div>
        <div
          v-if="partnerLogos"
          class="CountrySupporter"
        >
          <h4><translate>In-country support to DHA</translate></h4>
          <div class="SupporterLogos">
            <div
              v-for="(logo, index) in partnerLogos"
              :key="index"
              class="Partner"
            >
              <img
                :src="logo.image_url"
                alt="PartnerLogo">
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters({
      countryData: 'landing/getCountryData',
      landingPageDefaults: 'system/getLandingPageDefaults'
    }),
    countrySpecific () {
      return this.countryData !== null;
    },
    title () {
      return this.countrySpecific ? this.countryData.footer_title : this.landingPageDefaults.footer_title;
    },
    permanentFooterText () {
      return this.landingPageDefaults.permanent_footer;
    },
    countryText () {
      if (this.countrySpecific) {
        return this.countryData.footer_text;
      }
    },
    partnerLogos () {
      if (this.countrySpecific) {
        return this.countryData.partner_logos.length > 0 ? this.countryData.partner_logos : null;
      }
    }
  }
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
