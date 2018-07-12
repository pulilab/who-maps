<template>
  <div class="TopBar">

    <div class="LogoHolder">
      <img
        :src="logoURL"
        :alt="logoURL === '/placeholder-who-logo.jpg' ? 'WHO logo' : 'Country logo'"
        class="Logo">
    </div>

    <div class="RightPart">

      <language-selector />

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
    logoURL: {
      type: String,
      default: '/placeholder-who-logo.jpg'
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/style/main";

.TopBar {

  @include limitWidthWithPadding;
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

  .AuthLinks {
    display: flex;
    justify-content: flex-end;

    div {
      margin: 0 4px;
    }
  }
}
</style>
