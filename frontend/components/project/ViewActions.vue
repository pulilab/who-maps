<template>
  <div>
    <el-button
      v-for="action in actions"
      :key="action.id"
      v-bind="{ ...action }"
      @click="$emit('click', action.handle)"
    >
      {{ action.label }}
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    actions: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";

.button-plain(@color; @percentage: 5%) {
  background-color: white;

  color: @color;
  border: 1px solid @color!important;
  &:hover {
    color: lighten(@color, @percentage);
    border: 1px solid lighten(@color, @percentage) !important;
  }
}
.disabled() {
  &.is-disabled {
    color: #b9b9b9;
    background-image: none;
    background-color: #ebeef5 !important;
    border-color: #ebeef5 !important;
  }
}

div {
  .el-button + .el-button {
    margin-left: 0px;
  }
  display: flex;
  flex-direction: column;
  button {
    width: 100%;
    margin: 0 0 20px 0;
    font-size: 18px;
    &:last-child {
      margin: 0;
    }
  }
  .el-button--warning {
    background-color: #d86422;
    &:hover {
      background-color: lighten(#d86422, 5%);
    }
    .disabled();
  }

  .el-button--primary.is-plain {
    .button-plain(@colorBrandPrimary);
    .disabled();
  }
  .el-button--danger.is-plain {
    .button-plain(#d84315);
    .disabled();
  }
}
</style>
