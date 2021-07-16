<template>
  <div class="Group">
    <slot />
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";

.Group {
  border-left: 5px solid @colorGrayLight;
  margin-left: 8px;
  padding-left: 25px;
}

</style>
