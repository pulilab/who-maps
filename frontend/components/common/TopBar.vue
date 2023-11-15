<template>
  <div v-scroll-class:TopBarMin="180" class="TopBar">
    <el-row type="flex" justify="space-between" class="TopBarInner">
      <el-col class="LogoHolder">
        <nuxt-link :to=" localePath({ name: 'organisation', params: { organisation: '-' } })">
          <el-row type="flex" align="middle">
            <el-col class="LogoWHO">
              <img
                :src="customOrganisation ? organisationLogo : '/logo-who-blue.svg'"
                :alt="customOrganisation ? $gettext('Country logo') : $gettext('WHO logo')"
              >
            </el-col>
            <el-col class="Separator">
              <div />
            </el-col>
            <el-col class="LogoDHASmall">
              <img src="/logo-dha.svg" alt="Digital Health Atlas logo">
            </el-col>
          </el-row>
        </nuxt-link>
      </el-col>

      <el-col v-if="!errorPage" class="RightPart">
        <!-- ANON MODE -->
        <el-row
          :class="{ AnonView: !loggedIn, LoggedInView: loggedIn }"
          type="flex"
          justify="end"
          align="middle"
        >
          <template v-if="!loggedIn">
            <div class="HeaderBtn">
              <ToolkitDialogWrapper />
            </div>
            <div @click="openHowToDialog(0)">
              <translate class="HeaderBtn">How-to</translate>
            </div>
            <!-- <div>
              <a :href="storiesLink" target="_blank" class="HeaderBtn">
                <translate>Stories</translate>
              </a>
            </div> -->
            <div>
              <a :href="dataQualityLink" target="_blank" class="HeaderBtn">
                <translate>Data Quality Guideline</translate>
              </a>
            </div>
            <el-col>
              <div class="Separator" />
            </el-col>
            <el-col>
              <LanguageMenu />
            </el-col>

            <el-col class="AuthLinks">
              <div class="Separator" />
              <div>
                <nuxt-link
                  key="signupBtn"
                  :to="localePath({ name: 'organisation-signup', params: $route.params })"
                  class="HeaderBtn HideOnActive"
                >
                  <translate>Signup</translate>
                </nuxt-link>
              </div>
              <div>
                <nuxt-link
                  key="loginBtn"
                  :to="localePath({name: 'organisation-login', params: $route.params})"
                  class="HeaderBtn HideOnActive"
                >
                  <translate>Login</translate>
                </nuxt-link>
              </div>
            </el-col>
          </template>

          <NavigationMenu v-if="loggedIn" />

          <template v-if="loggedIn">
            <el-col>
              <el-row type="flex">
                <el-col>
                  <div class="Separator" />
                </el-col>
              </el-row>
            </el-col>
            <el-col class="AuthLinks">
              <div>
                <nuxt-link
                  key="newProjectBtn"
                  :to="
                    localePath({
                      name: 'organisation-projects-create',
                      params: $route.params
                    })
                  "
                  class="HeaderBtn"
                >
                  <fa icon="plus-circle" /><translate>New Project</translate>
                </nuxt-link>
              </div>
              <UserDropdown />
            </el-col>
          </template>

          <el-col>
            <el-row type="flex">
              <el-col>
                <div class="Separator" />
              </el-col>
            </el-row>
          </el-col>
          <template v-if="!customOrganisation || countrySpecific">
            <!-- <el-col>
              <nuxt-link
                :to="localePath({name: 'organisation',params: { organisation: 'covid-19' }})"
                class="HeaderBtn CovidLink"
              >
                COVID-19
              </nuxt-link>
            </el-col> -->
            <el-col>
              <country-chooser />
            </el-col>
          </template>
          <el-col
            v-else
            class="CountrySpecificMenu"
          >
            <div>
              <nuxt-link
                key="whoLandingBtn"
                :to="localePath({name: 'organisation', params: { organisation: landingData.code }})"
                class="HeaderBtn"
              >
                {{ landingData.name }}
              </nuxt-link>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <HowToDialog />
  </div>
</template>

<script>
import VueScrollClass from 'vue-scroll-class'
import { mapGetters, mapActions } from 'vuex'

import LanguageMenu from './LanguageMenu'
import NavigationMenu from './NavigationMenu'
import UserDropdown from './UserDropdown'
import ToolkitDialogWrapper from './ToolkitDialogWrapper'
import CountryChooser from './CountryChooser'
import HowToDialog from '@/components/dialogs/HowToDialog'

export default {
  data () {
    return {
      storiesLink: this.$gettext('https://stories.digitalhealthatlas.org'),
      dataQualityLink: this.$gettext('/download/Data_Quality_Guidebook_v2.0.pdf'),
    }
  },
  directives: {
    'scroll-class': VueScrollClass
  },
  components: {
    LanguageMenu,
    NavigationMenu,
    UserDropdown,
    ToolkitDialogWrapper,
    CountryChooser,
    HowToDialog
  },
  props: {
    errorPage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      landingData: 'landing/getLandingPageData',
      isCountry: 'landing/getIsCountry'
    }),
    customOrganisation () {
      return this.landingData !== null
    },
    countrySpecific () {
      return this.customOrganisation && this.landingData.code.length === 2
    },
    organisationLogo () {
      if (this.landingData) {
        return this.landingData.logo_url
      }
      return null
    },
    countryFlag () {
      if (this.landingData) {
        return `/static/flags/${this.landingData.code.toLowerCase()}.png`
      }
      return null
    },
    loggedIn() {
      return this.$auth.$state.loggedIn
    }
  },
  methods: {
    ...mapActions({
      openHowToDialog: 'layout/openHowToDialog'
    })
  }
}
</script>

<style lang="less">
@import "../../assets/style/variables.less";
@import "../../assets/style/mixins.less";

.TopBar {
  .TopBarInner {
    .limitPageWidth();
    height: @topBarHeight;
    background-color: @colorWhite;
    align-items: stretch;
  }
  .CovidLink {
    margin-left: -6px !important;
    margin-right: 10px !important;
    white-space: nowrap;
  }

  .LogoHolder {
    display: flex;
    align-self: center;
    width: auto;

    .LogoWHO {
      width: 100%;

      img {
        height: 48px;
      }
    }

    .LogoDHA {
      width: 100%;

      img {
        height: 38px;
        transform: translateY(2px);
      }
    }

    // TODO: this does not work!
    .LogoDHASmall {
      width: 100%;

      img {
        height: 32px;
        transform: translate(-3px, 2px);
      }
    }

    .Separator {
      width: auto;
      height: 36px;
      margin: 0 15px;

      > div {
        .SeparatorStyle();
      }
    }
  }

  .RightPart {
    padding: 15px 0;

    > .el-row > .el-col {
      width: auto;
    }
  }

  .HideOnActive {
    &.nuxt-link-active {
      display: none;
    }
  }

  .HeaderBtn {
    cursor: pointer;
    position: relative;
    height: 24px;
    margin: 0 10px;
    padding: 0;
    font-size: @fontSizeBase;
    font-weight: 700;
    line-height: 24px;
    color: @colorBrandPrimary;
    text-decoration: none;
    transition: @transitionAll;

    &::before {
      content: "";
      position: absolute;
      top: -21px;
      left: 0;
      display: inline-block;
      width: 100%;
      height: 4px;
      background-color: @colorWhite;
      transform: translateY(-4px);
      transition: @transitionAll;
    }

    &:hover {
      color: @colorBrandPrimaryLight;

      &::before {
        background-color: @colorBrandPrimaryLight;
        transform: translateY(0);
      }
    }

    &.nuxt-link-active {
      color: @colorBrandAccent;

      &::before {
        background-color: @colorBrandAccent;
        transform: translateY(0);
      }
    }

    .svg-inline--fa {
      margin-right: 6px;
    }

    span {
      display: inline-block
    }
  }

  .Separator {
    .SeparatorStyle();
    display: inline-block;
    margin: 0 20px;
  }

  .AuthLinks,
  .CountrySpecificMenu {
    .clearfix();

    > div {
      float: left;
      height: 24px;
    }
  }
}

.AngularHeaderButton,
.AngularHeaderButton.md-button {
  padding: 0 !important;
  margin: 0 !important;
  font-size: @fontSizeBase !important;
  font-weight: 700 !important;
  line-height: 24px !important;
  color: @colorBrandPrimary !important;
  text-decoration: none !important;
  transition: @transitionAll !important;
  text-align: left !important;
  min-height: auto !important;
  height: auto !important;
  width: 100% !important;

  // hacking Toolkit md-button :(
  min-height: auto;
  min-width: auto;
  overflow: visible;
  background-color: transparent !important;
  &.md-ink-ripple {
    > span {
      letter-spacing: 0 !important;
    }
    &::before {
      top: -17px !important;
    }
  }
  > .md-ripple-container {
    display: none;
  }
  //

  &:hover {
    background-color: transparent !important;
  }
}
</style>
