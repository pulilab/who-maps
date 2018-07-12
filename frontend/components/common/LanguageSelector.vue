<template>
  <div class="LanguageSelector">
    <div
      v-for="locale in $i18n.locales"
      :key="locale.code"
      class="LanguageLink">

      <nuxt-link
        :to="switchLocalePath(locale.code)"
        class="HeaderBtn">{{ locale.name }}</nuxt-link>

    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss">

.LanguageSelector {
  display: flex;
  justify-content: flex-end;

  .LanguageLink {
    margin: 0 4px;

    .nuxt-link-exact-active {
      color: red;
    }
  }
}

</style>
