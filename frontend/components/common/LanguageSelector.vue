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

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .LanguageSelector {
    .clearfix();

    .LanguageLink {
      display: inline-block;
      float: left;
    }
  }

</style>
