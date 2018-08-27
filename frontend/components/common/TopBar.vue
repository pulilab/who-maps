<template>
  <div
    v-scroll-class:TopBarMin="180"
    class="TopBar">
    <el-row
      type="flex"
      justify="space-between"
      class="TopBarInner"
    >

      <el-col class="LogoHolder">
        <nuxt-link :to="localePath({name: 'organisation', params: $route.params})">
          <img
            :src="countrySpecific ? countryLogoURL : '/logo-who-blue.svg'"
            :alt="countrySpecific ? 'Country logo' : 'WHO logo'"
            class="Logo">
        </nuxt-link>
      </el-col>

      <el-col class="RightPart">
        <!-- ANON MODE -->
        <el-row
          :class="{'AnonView': !user, 'LoggedInView': user}"
          type="flex"
          justify="end">

          <el-col
            v-if="countrySpecific"
            class="CountryHolder">
            <img
              :src="countryFlag"
              alt="country flag"
              class="CountryFlag">
            <div class="CountryName">{{ countryData.name }}</div>
          </el-col>

          <template v-if="!user">
            <el-col v-if="!countrySpecific">
              <language-selector />
            </el-col>

            <el-col class="AuthLinks">
              <div class="Separator" />
              <div>
                <nuxt-link
                  :to="localePath({name: 'organisation-signup', params: $route.params})"
                  class="HeaderBtn HideOnActive">Signup</nuxt-link>
              </div>

              <div>
                <nuxt-link
                  :to="localePath({name: 'organisation-login', params: $route.params})"
                  class="HeaderBtn HideOnActive">Login</nuxt-link>
              </div>
            </el-col>
          </template>
          <template v-if="user">
            <el-col class="AuthLinks">
              <div>
                <nuxt-link
                  :to="localePath({name: 'organisation-dashboard', params: $route.params})"
                  class="HeaderBtn"
                >
                  Dashboard
                </nuxt-link>
              </div>
              <div>
                <nuxt-link
                  :to="localePath({name: 'organisation-projects', params: $route.params})"
                  class="HeaderBtn"
                >
                  My Projects
                </nuxt-link>
              </div>
              <div>
                <nuxt-link
                  :to="localePath({name: 'organisation-cms', params: $route.params})"
                  class="HeaderBtn"
                >
                  Planning and Guidance
                </nuxt-link>
              </div>
              <div>
                <toolkit-dialog-wrapper />
              </div>
              <div>
                <nuxt-link
                  :to="localePath({name: 'organisation-projects-create', params: $route.params})"
                  class="HeaderBtn">
                  <fa icon="plus-circle" />
                  New Project
                </nuxt-link>
              </div>
              <user-dropdown />
            </el-col>
          </template>

          <el-col
            v-if="countrySpecific"
            class="CountrySpecificMenu">
            <div class="Separator" />
            <div>
              <nuxt-link :to="localePath({name: 'organisation', params: {organisation: 'who'}})">
                <img
                  class="LogoSmall"
                  alt="WHO logo small"
                  src="/logo-who-blue.svg">
              </nuxt-link>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VueScrollClass from 'vue-scroll-class';
import { mapGetters } from 'vuex';

import LanguageSelector from './LanguageSelector';
import UserDropdown from './UserDropdown';
import ToolkitDialogWrapper from './ToolkitDialogWrapper';

export default {
  directives: {
    'scroll-class': VueScrollClass
  },
  components: {
    LanguageSelector,
    UserDropdown,
    ToolkitDialogWrapper
  },
  computed: {
    ...mapGetters({
      user: 'user/getProfile',
      countryData: 'landing/getCountryData'
    }),
    countrySpecific () {
      return this.countryData !== null;
    },
    countryLogoURL () {
      if (this.countryData) {
        return this.countryData.logo;
      }
    },
    countryFlag () {
      if (this.countryData) {
        return `/static/flags/${this.countryData.code.toLowerCase()}.png`;
      }
    }

  }
};
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

    .LogoHolder {
      align-self: center;
      width: auto;

      .Logo {
        height: 54px;
      }
    }

    .RightPart {
      padding: 16px 0;
      transform: translateX(10px);

      > .el-row > .el-col {
        width: auto;
      }
    }

    .HideOnActive {
      &.nuxt-link-active {
        display: none;
      }
    }

    .HeaderBtn
    // TODO: Remove Angular Material
    // hacking Toolkit md-button :(
    ,.HeaderBtn.md-button
    //
    {
      position: relative;
      height: 24px;
      margin: 0 10px;
      padding: 0 10px;
      font-size: @fontSizeBase;
      font-weight: 700;
      line-height: 24px;
      color: @colorBrandPrimary;
      text-decoration: none;
      transition: @transitionAll;

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
          top: -16px !important;
        }
      }

      > .md-ripple-container {
        display: none;
      }
      //

      &::before {
        content: "";
        position: absolute;
        top: -20px;
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

      &.nuxt-link-exact-active {
        color: @colorBrandAccent;

        &::before {
          background-color: @colorBrandAccent;
          transform: translateY(0);
        }
      }

      .svg-inline--fa {
        margin-right: 2px;
      }
    }

    .Separator {
      .SeparatorStyle();
      margin: 0 10px;
    }

    .CountryHolder {
      .CountryFlag {
        height: 20px;
      }
    }

    .AuthLinks,
    .CountrySpecificMenu {
      .clearfix();

      > div {
        float: left;
      }
    }

    .LogoSmall {
      position: relative;
      top: -3px;
      height: 30px;
      margin-left: 20px;
    }
  }
</style>
