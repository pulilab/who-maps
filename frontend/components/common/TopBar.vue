<template>
  <!-- TODO -->
  <!-- Add toggle class '.TopBarMin' if user scrolled down more than 180px -->
  <div class="TopBar">
    <el-row
      type="flex"
      justify="space-between"
      class="TopBarInner"
    >

      <el-col class="LogoHolder">
        <div>
          <img
            :src="countrySpecific ? countryLogoURL : '/logo-who-blue.svg'"
            :alt="countrySpecific ? 'Country logo' : 'WHO logo'"
            class="Logo">
        </div>
      </el-col>

      <el-col class="RightPart">
        <el-row
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
                class="HeaderBtn">Signup</nuxt-link>
            </div>

            <div>
              <nuxt-link
                :to="localePath('index-login')"
                class="HeaderBtn">Login</nuxt-link>
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LanguageSelector from './LanguageSelector';
export default {
  components: {
    LanguageSelector
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
      height: 30px;
    }
  }
</style>
