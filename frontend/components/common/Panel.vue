<template>
  <div class="Panel" :class="{'empty': empty}">
    <div class="header shadow" :class="[alignTitle, {'empty': empty}]">
      <slot name="header" />
    </div>
    <div class="body" :class="{'wide' : wideBody}">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    empty: {
      type: Boolean,
      default: false
    },
    alignTitle: {
      type: String,
      default: 'center',
      validator (value) {
        return ['center', 'left', 'right'].indexOf(value) !== -1
      }
    },
    wideBody: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .Panel {
    background-color: @colorWhite;
    &.shadow {
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    }
    &.empty {
      color: @colorGray;
      background-color: @colorGrayLightest !important;
    }
    .header {
      padding: 0 40px;
      height: 58px;
      line-height: 58px;
      color: @colorWhite;
      background-color: @colorBrandPrimaryDark !important;
      font-size: @fontSizeLarger !important;
      font-weight: 700;
      &.empty {
        background-color: @colorTextMuted !important;
      }
      &.left {
        text-align: left;
      }
      &.center {
        text-align: center;
      }
      &.right {
        text-align: right;
      }
    }
    .body {
      padding: 30px 40px;
      &.wide {
        padding: 0;
      }
    }
  }
</style>
