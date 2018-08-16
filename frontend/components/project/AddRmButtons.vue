<template>
  <div class="AddRmButtons">
    <el-button
      :disabled="!showAdd"
      type="text"
      class="AddButton IconLeft"
      @click="$emit('add')">
      <fa icon="plus" />
      Add
    </el-button>
    <el-button
      v-show="showRm"
      type="text"
      class="DeleteButton IViewert"
      @click="$emit('rm')">
      <fa icon="minus" />
      Delete
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
    padding-left: 30px;

    .DeleteButton {
      margin-left: 30px;
    }

    .svg-inline--fa {
      width: 16px;
    }
  }

</style>
