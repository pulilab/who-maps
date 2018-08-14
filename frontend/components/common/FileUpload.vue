<template>
  <el-upload
    :auto-upload="false"
    :on-remove="handleChange"
    :on-change="handleChange"
    :list-type="limit === 1 ? 'picture' : 'picture-card'"
    class="upload-demo"
    action="doing it manually, so this prop isnt used, still needed">
    <el-row
      v-if="files.length < limit && limit === 1"
      type="flex">
      <el-button
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
