<template>
  <div class="TopBar">
    <language-selector />
    <div class="separator" />
    <div>
      <nuxt-link :to="localePath('index-signup')">Signup</nuxt-link>
      <nuxt-link :to="localePath('index-login')">Login</nuxt-link>
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

<style>

</style>
