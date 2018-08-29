<template>
  <el-upload
    :auto-upload="false"
    :disabled="disabled"
    :on-remove="handleChange"
    :on-change="handleChange"
    :list-type="'picture'"
    :file-list="files"
    class="upload-demo"
    action="doing it manually, so this prop isnt used, still needed">
    <el-row
      v-if="files.length < limit"
      type="flex">
      <el-button
        v-if="!disabled"
        icon="el-icon-plus"
        type="text">Upload file</el-button>
      <div v-if="files.length === 0">No file chosen</div>
    </el-row>
  </el-upload>
</template>

<script>
export default {
  props: {
    files: {
      required: true,
      type: Array
    },
    limit: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleChange (file, fileList) {
      this.$emit('update:files', fileList);
    }
  }
};
</script>

<style lang="less">
</style>
