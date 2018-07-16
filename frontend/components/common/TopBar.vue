<template>
  <div class="TopBar">

    <div class="LogoHolder">
      <img
        :src="countrySpecific ? countryLogoURL : '/mock/placeholder-who-logo.jpg'"
        :alt="countrySpecific ? 'Country logo' : 'WHO Logo'"
        class="Logo">
    </div>

    <div class="RightPart">

      <div
        v-if="countrySpecific"
        class="CountryHolder">
        <img
          src="/static/flags/sl.png"
          alt="country flag"
          class="CountryFlag">
        <div class="CountryName">Sierra Leone</div>
      </div>

      <language-selector v-if="!countrySpecific"/>

      <div class="Separator" />

      <div class="AuthLinks">
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
      </div>

      <div
        v-if="countrySpecific"
        class="Separator" />

      <img
        v-if="countrySpecific"
        class="SmallWHOLogo"
        alt="WHO logo small"
        src="/mock/placeholder-who-logo.jpg">

    </div>

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
@import "../../assets/style/main.less";

.TopBar {

  .limitWidthWithPadding();
  display: flex;
  justify-content: space-between;

  .RightPart {
    display: flex;
    justify-content: space-between;
  }

  .LogoHolder {
    padding: 20px 0;

    .Logo {
      height: 50px;
    }
  }

  .Separator {
    width: 1px;
    height: 18px;
    background-color: gray;
    margin: 0 4px;
  }

  .CountryHolder {
    display: flex;
    justify-content: flex-end;

    .CountryFlag {
      height: 20px;
    }

    // .CountryName {}
  }

  .AuthLinks {
    display: flex;
    justify-content: flex-end;

    div {
      margin: 0 4px;
    }
  }

  .SmallWHOLogo {
    height: 20px;
    margin: 5px 0;
  }
}
</style>
