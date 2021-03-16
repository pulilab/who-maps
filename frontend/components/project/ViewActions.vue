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
      required: true,
    },
  },
};
</script>

<style lang="less" scoped>
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
}
</style>
