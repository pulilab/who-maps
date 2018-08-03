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
        <nuxt-link :to="localePath('index')">
          <img
            :src="countrySpecific ? countryLogoURL : '/logo-who-blue.svg'"
            :alt="countrySpecific ? 'Country logo' : 'WHO logo'"
            class="Logo">
        </nuxt-link>
      </el-col>

      <el-col class="RightPart">
        <!-- ANON MODE -->
        <el-row
          v-if="!user"
          class="AnonView"
          type="flex"
          justify="end">
          <el-col
            v-if="countrySpecific"
            class="CountryHolder">
            <img
              src="/static/flags/sl.png"
              alt="country flag"
              class="CountryFlag">
            <div class="CountryName">Sierra Leone</div>
          </el-col>

          <el-col v-if="!countrySpecific">
            <language-selector />
          </el-col>

          <el-col class="AuthLinks">
            <div class="Separator" />
            <div>
              <nuxt-link
                :to="localePath('index-signup')"
                class="HeaderBtn HideOnActive">Signup</nuxt-link>
            </div>

            <div>
              <nuxt-link
                :to="localePath('index-login')"
                class="HeaderBtn HideOnActive">Login</nuxt-link>
            </div>
          </el-col>

          <el-col
            v-if="countrySpecific"
            class="CountrySpecificMenu">
            <div class="Separator" />
            <div>
              <img
                class="LogoSmall"
                alt="WHO logo small"
                src="/logo-who-blue.svg">
            </div>
          </el-col>
        </el-row>
        <!-- LOGGED IN MODE -->
        <el-row
          v-if="user"
          class="LoggedInView"
          type="flex"
          justify="end">
          <el-col class="AuthLinks">
            <div>
              <nuxt-link
                :to="localePath('index-dashboard')"
                class="HeaderBtn"
              >
                Dashboard
              </nuxt-link>
            </div>
            <div>
              <nuxt-link
                :to="localePath('index-projects')"
                class="HeaderBtn"
              >
                My Projects
              </nuxt-link>
            </div>
            <div>
              <nuxt-link
                :to="localePath('index-cms')"
                class="HeaderBtn"
              >
                Planning and Guidance
              </nuxt-link>
            </div>
            <div>
              <el-button
                type="text"
                class="HeaderBtn"
              >
                Toolkit
              </el-button>
            </div>
            <div>
              <nuxt-link
                :to="localePath('index-projects-create')"
                class="HeaderBtn">
                <i class="el-icon-plus" />
                New Project
              </nuxt-link>
            </div>
            <user-dropdown class="HeaderBtn" />
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

export default {
  directives: {
    'scroll-class': VueScrollClass
  },
  components: {
    LanguageSelector,
    UserDropdown
  },
  props: {
    countrySpecific: {
      type: Boolean,
      default: false
    },
    countryLogoURL: {
      type: String,
      default: '/mock/placeholder-sl.png'
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/getProfile'
    })
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .TopBar {

    .TopBarInner {
      .limitPageWidth();
      height: 130px;
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
      position: relative;
      height: 24px;
      margin: 0 10px;
      padding: 0 10px;
      font-size: @fontSizeBase;
      font-weight: 700;
      line-height: 24px;
      color: @colorBrandPrimary;
      text-decoration: none;

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
        &::before {
          background-color: @colorBrandPrimary;
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
