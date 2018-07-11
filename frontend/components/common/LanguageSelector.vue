<template>
  <div class="LanguageSelector">
    <div
      v-for="locale in $i18n.locales"
      :key="locale.code">

      <nuxt-link :to="switchLocalePath(locale.code)">{{ locale.name }}</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style>

</style>
