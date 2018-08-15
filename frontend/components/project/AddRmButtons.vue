<template>
  <div class="AddRmButtons">
    <el-button
      :disabled="!showAdd"
      type="text"
      class="AddButton IconLeft"
      @click="$emit('add')">
      <fa icon="plus" />
      Add more
    </el-button>
    <el-button
      v-show="showRm"
      type="text"
      class="RemoveButton IViewert"
      @click="$emit('rm')">
      <fa icon="minus" />
      Remove
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    showRm: {
      type: Boolean,
      default: false
    },
    showAdd: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .AddRmButtons {
    padding: 0 30px;

    .RemoveButton {
      margin-left: 30px;
      color: @colorDanger;
    }
  }

</style>
