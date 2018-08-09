<template>
  <div class="AddRmButtons">
    <el-button
      v-show="showAdd"
      type="text"
      @click="$emit('add')">
      <fa icon="plus" />
      Add more
    </el-button>
    <el-button
      v-show="showRm"
      type="text"
      @click="$emit('rm')">
      <fa icon="minus" />
      remove
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

<style>

</style>
