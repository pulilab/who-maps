<template>
  <div class="ApprovalTag">
    <el-tag
      :type="value ? 'success' : value === null ? 'info' : 'warning'"
      disable-transitions>
      <span v-show="value === true"> <translate>Yes</translate></span>
      <span v-show="value === false"> <translate>No</translate></span>
      <span v-show="value === null"> <translate>Pending</translate> </span>
    </el-tag>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: null
    }
  }
};
</script>

<style>

</style>
