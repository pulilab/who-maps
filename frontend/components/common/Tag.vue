<template>
  <span :class="`tag ${type}`">
    <translate>{{ label }}</translate>
  </span>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";
.tag {
  display: inline-block;
  padding: 6px 16px;
  font-size: 11px;
  font-weight: 700;
  line-height: 12px;
  border-radius: 12px;
  text-transform: uppercase;
  color: @colorTextPrimary;
  background-color: @colorGrayLight;
  &.draft {
    background-color: @colorDraft;
  }
  &.publish {
    background-color: @colorPublished;
    color: @colorWhite;
  }
}
</style>
