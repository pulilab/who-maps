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
@import '~assets/style/variables.less';
@import '~assets/style/mixins.less';

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
    background-color: @colorBrandAccent;
    &:hover {
      background-color: lighten(@colorBrandAccent, 5%);
    }
    .disabled();
  }

  .el-button--primary.is-plain {
    .button-plain(@colorBrandPrimary);
    .disabled();
  }
  .el-button--danger.is-plain {
    .button-plain(@colorDanger);
    .disabled();
  }
}
</style>
