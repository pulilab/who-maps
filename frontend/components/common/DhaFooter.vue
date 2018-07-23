<template>
  <div class="FooterBg">
    <div class="Footer">
      <b>
        <span>Disclaimer:</span>
      </b>
      <span>
        All reasonable precautions have been taken by the World Health Organization to verify the information contained in this publication. However, the published material is being distributed without warranty of any kind, either expressed or implied. The responsibility for the interpretation and use of the material lies with the reader. In no event shall the World Health Organization be liable for damages arising from its use.
      </span>
      <nuxt-link :to="localePath('index-terms')">Terms of use</nuxt-link>
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

  .FooterBg {
    background-color: @colorBrandGrayDark;
    align-items: flex-end;

    .Footer {
      .limitPageWidth();
      padding: 40px;
      font-size: @fontSizeSmall;
      line-height: 18px;
      text-align: center;
      color: @colorTextMuted;

      a {
        color: inherit;
      }
    }
  }
</style>
