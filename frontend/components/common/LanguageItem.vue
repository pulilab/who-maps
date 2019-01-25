<template>
  <el-row
    v-if="language"
    type="flex"
    class="LanguageItem"
  >
    <el-col class="LanguageFlag">
      <img :src="language.flag">
    </el-col>
    <el-col class="LanguageName">
      {{ language.name }}
    </el-col>
  </el-row>
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
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .LanguageItem {
    .LanguageFlag {
      width: auto;

      img {
        width: 24px;
        height: 14px;
      }
    }

    .LanguageName {
      width: 100%;
      margin-left: 10px;
      font-size: @fontSizeMedium;
      font-weight: 700;
      line-height: 16px;
      color: @colorTextPrimary;
    }
  }
</style>
