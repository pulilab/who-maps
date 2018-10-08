<template>
  <div class="FooterBg">
    <div class="Footer">
      <b>
        <span><translate>Disclaimer:</translate>&nbsp;</span>
      </b>
      <span>
        <translate>All reasonable precautions have been taken by the World Health Organization to verify the information contained in this publication. However, the published material is being distributed without warranty of any kind, either expressed or implied. The responsibility for the interpretation and use of the material lies with the reader. In no event shall the World Health Organization be liable for damages arising from its use.</translate>
      </span>
      <nuxt-link :to="localePath({name: 'organisation-terms', params: $route.params})"><translate>Terms of use</translate></nuxt-link>
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
    display: flex;
    align-items: center;
    height: @appFooterHeight;
    background-color: @colorBrandGrayDark;

    .Footer {
      padding: 0 160px;
      font-size: @fontSizeSmall;
      line-height: 18px;
      text-align: center;
      color: @colorTextMuted;

      a {
        color: inherit;
        margin: 0 6px;
      }
    }
  }
</style>
