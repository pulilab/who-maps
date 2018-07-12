<template>
  <div class="TopBar">
    <language-selector />
    <div class="separator" />
    <div class="AuthLinks">
      <div>
        <nuxt-link :to="localePath('index-signup')">Signup</nuxt-link>
      </div>
      <div>
        <nuxt-link :to="localePath('index-login')">Login</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import LanguageSelector from './LanguageSelector';
export default {
  components: {
    LanguageSelector
  }
};
</script>

<style lang="scss">
  .TopBar {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .separator {
      width: 1px;
      height: 18px;
      background-color: gray;
      margin: 0 4px;
    }

    .AuthLinks {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      div {
        margin: 0 4px;
      }
    }
  }
</style>
