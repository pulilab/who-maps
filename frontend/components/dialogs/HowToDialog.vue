<template>
  <el-dialog
    :visible.sync="dialog"
    :title="$gettext('Digital Health Atlas How-to') | translate"
    modal
    :show-close="true"
    top="10vh"
    width="80vw"
  >
      <div class="HowToDialog">
        <div class="AdminPersonaChooser">
          <div :class="['Persona', { active: selectedGuide === 0 }]" @click="selectGuide(0)">
            <svg viewBox="0 0 20 20" class="icon">
              <g fill="none" fill-rule="evenodd">
                <path d="M0 0h20v20H0z"/>
                <path fill="currentColor" fill-rule="nonzero" d="m10 2.5-9.167 7 1.009 1.325 1.491-1.142V17.5h13.334V9.683l1.491 1.134L19.167 9.5 10 2.5Zm-3.333 10a.836.836 0 0 1-.834-.833c0-.459.375-.834.834-.834.458 0 .833.375.833.834a.836.836 0 0 1-.833.833Zm3.333 0a.836.836 0 0 1-.833-.833c0-.459.375-.834.833-.834.458 0 .833.375.833.834A.836.836 0 0 1 10 12.5Zm3.333 0a.836.836 0 0 1-.833-.833c0-.459.375-.834.833-.834.459 0 .834.375.834.834a.836.836 0 0 1-.834.833Z"/>
              </g>
            </svg>
            <div class="PersonaName">
              <translate>Overview</translate>
            </div>
            <fa class="chevron" icon="chevron-right" />
          </div>
          <div :class="['Persona', { active: selectedGuide === 1 }]" @click="selectGuide(1)">
            <svg viewBox="0 0 20 20" class="icon">
              <path fill="currentColor" fill-rule="nonzero" d="M14.003 1.056c.423.006 2.797.14 3.198 3.118.425 3.147.57 3.95 1.217 4.637 0 0-1.906.708-2.84.58l.002.688C17.243 11.976 20 12.322 20 13.9v1.719a.375.375 0 0 1-.367.382H8.268a.375.375 0 0 1-.367-.382v-1.72c0-1.576 2.757-1.922 4.42-3.819l.003-.687c-.935.127-2.84-.581-2.84-.581.646-.688.792-1.49 1.216-4.637.4-2.977 2.775-3.112 3.198-3.118ZM6.03 0c.625.002 2.27.187 2.584 2.069.013.075.023.153.031.234.033.327.056.64.068.942.015.387.014.755-.004 1.103a.91.91 0 0 1 .183.446c.016.11.02.228.006.35-.038.367-.21.667-.42.78a6.125 6.125 0 0 1-.083.286 5 5 0 0 1-.912 1.707v.46c.866.989 2.05 1.523 2.921 2.06-1.76 1.456-3.916 2.02-4.158 3.433H.341A.348.348 0 0 1 0 13.515v-1.594c0-1.462 2.55-1.783 4.093-3.543v-.461a4.91 4.91 0 0 1-.817-1.431 5.816 5.816 0 0 1-.177-.562c-.21-.113-.382-.413-.421-.78-.013-.122-.01-.24.006-.35a.903.903 0 0 1 .183-.446c-.018-.348-.02-.716-.003-1.103.012-.302.034-.615.067-.942.008-.081.019-.16.031-.234C3.276.187 4.922 0 5.546 0Z"/>
            </svg>
            <div class="PersonaName">
              <translate>Implementor</translate>
            </div>
            <fa class="chevron" icon="chevron-right" />
          </div>
          <div :class="['Persona', { active: selectedGuide === 2 }]" @click="selectGuide(2)">
            <svg viewBox="0 0 16 16" class="icon">
              <path fill="currentColor" fill-rule="nonzero" d="M4.114 8.226v.307H3.2v-1.6h9.6v1.6h-.914v-.307L8 7.319l-3.886.907ZM11.2 14.4H9.92V9.417H8.64V14.4H7.36V9.417H6.08V14.4H4.8V8.333L8 7.467l3.2.866V14.4Zm-.533-8.457V6.4H5.333v-.457c0-1.359.962-2.484 2.223-2.702v-.612c0-.063.05-.115.11-.115h.112V.23C7.778.102 7.878 0 8 0c.123 0 .222.102.222.229V.33c.783.403 1.428-.292 2.445.126V2.05c-1.017-.418-1.662.277-2.445-.126v.591h.111c.062 0 .111.051.111.115v.612c1.261.218 2.223 1.343 2.223 2.702Zm-6.553 8.99h7.772L12.8 16H3.2l.914-1.067Zm7.62-5.866H16V16h-2.733l-.318-.306-.898-.867-.132-.127h-.186V9.067ZM4.08 14.7l-.132.127-.898.867-.318.306H0V9.067h4.267V14.7H4.08Z"/>
            </svg>
            <div class="PersonaName">
              <translate>Government user</translate>
            </div>
            <fa class="chevron" icon="chevron-right" />
          </div>
          <div :class="['Persona', { active: selectedGuide === 3 }]" @click="selectGuide(3)">
            <svg viewBox="0 0 16 18" class="icon">
              <path fill="currentColor" fill-rule="nonzero" d="M10.42 15.37H8.157l-.62-2.87c1.26-1.779-.091-1.853-.328-1.853-.238 0-1.57.092-.329 1.852l-.62 2.87H0v-2.055c0-.426.182-.852.511-1.13 1.843-1.537 3.832-2.556 4.234-2.76.036-.018.073-.074.073-.11V8.238c-.274-.463-.42-1-.493-1.463-.164-.019-.383-.24-.602-1.056-.31-1.13.018-1.296.292-1.26a2.88 2.88 0 0 1-.073-1.703c.146-.63.474-1.13.858-1.538.237-.259.51-.481.803-.666.237-.167.492-.297.766-.408a2.21 2.21 0 0 1 .712-.13 2.91 2.91 0 0 1 1.77.37c.62.353.858.816.858.816s1.57.111.876 3.445c.219.074.365.37.11 1.24-.293 1.075-.567 1.13-.73 1.02-.074.37-.183.777-.366 1.166v1.241c0 .056.037.093.073.111.2.112.84.426 1.643.927-.676.444-1.077 1.13-1.114 1.981-.036.667.146 1.612 1.296 2.316.018 0 .018.018.037.018a.912.912 0 0 0-.238-.037c-.182.019-.657.093-.876.74Zm3.358 1.537c.402-.11.73-.333 1.004-.648.73-.89.438-2.186-.584-2.778-.328-.186-.657-.315-1.004-.463a2.016 2.016 0 0 1-.547-.315c-.329-.26-.256-.686.128-.87.11-.056.219-.056.328-.075a2.49 2.49 0 0 1 1.26.26c.2.092.273.074.328-.149.073-.222.128-.444.2-.666.037-.149-.018-.26-.145-.315a3.088 3.088 0 0 0-.803-.241c-.365-.056-.365-.056-.365-.426 0-.519 0-.519-.511-.519h-.22c-.237 0-.273.056-.291.297v.333c0 .333 0 .315-.31.426-.749.278-1.205.796-1.26 1.611-.036.723.329 1.223.913 1.575.365.222.766.352 1.15.518.145.074.291.149.419.26.365.315.31.833-.146 1.018-.237.111-.474.13-.73.093a3.469 3.469 0 0 1-1.131-.333c-.201-.112-.274-.075-.347.148-.055.203-.11.389-.164.592-.073.26-.055.334.2.463.329.167.657.241 1.022.297.274.037.274.055.292.352v.389c0 .166.073.259.256.259h.566c.146 0 .237-.093.237-.24v-.538c.018-.185.091-.278.255-.315Z"/>
            </svg>
            <div class="PersonaName">
              <translate>Investor</translate>
            </div>
            <fa class="chevron" icon="chevron-right" />
          </div>
          <div class="HowToInfoBox">
            <p>
              <translate>The DHA How-to is designed to provide an overview of the less well-known features of the site and to share a vision for the direction of the platform.</translate>
            </p>
            <p>
              <translate>We are available via email on</translate>
              <a href="mailto:digital-health-atlas@who.int">digital-health-atlas@who.int</a>
            </p>
            <p>
              <translate>For more info please visit</translate>:
              <a href="http://wiki.digitalhealthatlas.org" target="_blank">http://wiki.digitalhealthatlas.org</a>
            </p>
          </div>
        </div>
        <HowtoGuide :guide="guides[selectedGuide]" />
      </div>
  </el-dialog>
</template>

<script>
import { mapGettersActions } from '../../utilities/form'
import HowtoGuide from '@/components/common/HowtoGuide'

export default {
  components: {
    HowtoGuide
  },
  data() {
    return {
      guides: [
        {
          title: this.$gettext('Overview'),
          description: this.$gettext('The DHA helps technical implementers to share details about their projects globally. This page will provide an overview of the key features available on the platform. Technical Implementers can use the DHA to register their projects globally.'),
          subTitle: this.$gettext('See Digital Health Atlas in action'),
          subDescription: this.$gettext('Get a feel for Digital Health Atlas features and let us walk you through some common use cases'),
          videoId: this.$gettext('overview_video_id') === 'overview_video_id' ? 'qEFzi0OtJMQ' : this.$gettext('overview_video_id'),
        },
        {
          title: this.$gettext('Implementor'),
          description: this.$gettext('For technologists and health experts deploying digital health software, the DHA can help to gather insights regarding the technology landscape in a country. The DHA can be searched at national or sub-national level, and also by health focus area. You can understand the health priorities of a country by visiting the Country Pages If you or your team are considering deploying your project, these insights can help improve the success and strategic value of your work. Digital health projects increasingly require more advanced planning to align with government priorities, data collection and data format requirements and to reduce duplication of project activities.'),
          subTitle: this.$gettext('See Digital Health Atlas in action'),
          subDescription: this.$gettext('Get a feel for Digital Health Atlas features and let us walk you through some common use cases'),
          videoId: this.$gettext('implementor_video_id') === 'implementor_video_id' ? 'J90lz-tKTrI' : this.$gettext('implementor_video_id'),
        },
        {
          title: this.$gettext('Government user'),
          description: this.$gettext('To help with this decision-making, planning and monitoring, the DHA provides Ministry of health ( MOH ) with a specifically-designed data set which gives the MOH a snapshot of each Digital Health program. This informs evaluation, planning and scale strategies. The following video provides an tutorial and overview form the perspective of a MOH Government user.'),
          subTitle: this.$gettext('See Digital Health Atlas in action'),
          subDescription: this.$gettext('Get a feel for Digital Health Atlas features and let us walk you through some common use cases'),
          videoId: this.$gettext('government_video_id') === 'government_video_id' ? 'MCQsBxVU2qk' : this.$gettext('government_video_id'),
        },
        {
          title: this.$gettext('Investor'),
          description: this.$gettext('The DHA allows investors and donors to understand the other financial investors within a country, the current scale and essential intervention focus of a digital health program, and, through the MAPS toolkit, the relative readiness of a specific digital health project for scale. The following video provides an tutorial and overview form the perspective of a W.H.O Donor/Investor.'),
          subTitle: this.$gettext('See Digital Health Atlas in action'),
          subDescription: this.$gettext('Get a feel for Digital Health Atlas features and let us walk you through some common use cases'),
          videoId: this.$gettext('investor_video_id') === 'investor_video_id' ? 'oPflbsrvDWo' : this.$gettext('investor_video_id'),
        },
      ]
    }
  },
  computed: {
    ...mapGettersActions({
      dialog: ['layout', 'getHowToDialogState', 'setHowToDialogState', 0],
      selectedGuide: ['layout', 'getHowToDialogGuide', 'setHowToDialogGuide']
    })
  },
  methods: {
    selectGuide(guide) {
      this.selectedGuide = guide
    }
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

::v-deep .el-dialog {
  height: 80vh;
}

::v-deep .el-dialog__body {
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.HowToDialog {
  display: flex;
  height: calc(100% - 66px);

  .AdminPersonaChooser {
    display: flex;
    flex-direction: column;
    width: 232px;
    border-right: 2px solid @colorGrayLighter;

    .Persona {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 20px;
      border-bottom: 1px solid @colorGrayLighter;
      cursor: pointer;
      transition: @transitionAll;

      .PersonaName {
        flex: 1;
        color: @colorTextSecondary;
        font-size: @fontSizeBase;
        line-height: 16px;
      }

      .icon {
        width: 20px;

      }

      .chevron  {
        height: 14px;
        opacity: 0;
        transition: @transitionAll;
      }

      &:hover {
        background-color: @colorGrayLightest;

        .PersonaName {
          color: @colorTextPrimary;
        }

        .chevron {
          opacity: 0.5;
        }
      }

      &.active {
        background-color: mix(@colorWhite, @colorBrandPrimary, 90%);
        border-color: mix(@colorWhite, @colorBrandPrimary, 70%);
        color: @colorBrandPrimary;

        .PersonaName {
          font-weight: 700;
          color: @colorBrandPrimary;
        }

        .chevron {
          color: @colorBrandPrimary;
          opacity: 1;
        }
      }
    }

    .HowToInfoBox {
      margin-top: auto;
      padding: 30px 20px;
      color: @colorTextSecondary;
      font-size: @fontSizeSmall;
      line-height: 18px;
      * {
        word-break: normal;
      }
      a {
        color: @colorBrandPrimaryLight;
      }
    }
  }
}
</style>