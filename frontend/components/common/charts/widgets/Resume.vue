<template>
  <el-row :class="!noBorder && 'border'">
    <p class="title"><slot /></p>
    <el-row type="flex" align="middle" justify="start" class="margin-bottom">
      <slot name="content" />
    </el-row>
  </el-row>
</template>

<script>
export default {
  props: {
    noBorder: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  color: #1cabe2;
  font-size: 18px;
  letter-spacing: -0.5px;
  line-height: 23px;
  margin: 9px 0 11px 0;
}
.margin-bottom {
  margin-bottom: 9px;
}
.border {
  border-right: 1px solid #eae6e1;
}
</style>
