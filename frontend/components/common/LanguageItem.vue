<template>
  <div class="LanguageItem">
    <img :src="language.flag" >
    <span> {{ language.name }} </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    code: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getLanguageDetails: 'system/getLanguageDetails'
    }),
    language () {
      return this.getLanguageDetails(this.code);
    }
  }
};
</script>

<style lang="less">
  .LanguageItem {
    img {
      height: 14px;
      width: 20px;
    }
  }
</style>
