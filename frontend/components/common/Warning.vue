<template>
  <div class="Warning">
    <fa class="icon" icon="exclamation-triangle" />
    <div class="text">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";

.Warning {
  display: flex;
  margin: 26px 0;
  .icon {
    color: #FAA806;
    margin-right: 12px;
  }
  .text span {
    color: @colorTextSecondary;
    font-size: @fontSizeSmall;
    line-height: 18px;
  }
}

</style>
