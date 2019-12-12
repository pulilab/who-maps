<template>
  <el-row :gutter="20" type="flex" class="matrix-layout">
    <el-col :span="8">
      <el-row class="fill">
        <el-col :span="24" class="mb">
          <slot name="lefttop"></slot>
        </el-col>
        <el-col :span="24" class="fill">
          <slot name="leftbottom"></slot>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="8">
      <slot name="middle"></slot>
    </el-col>
    <el-col :span="8">
      <slot name="right"></slot>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'ThreeColumns',
  props: {
  }
};
</script>

