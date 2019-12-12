<template>
  <el-row :gutter="20" type="flex" class="matrix-layout">
    <el-col :span="16">
      <el-row class="fill">
        <el-col :span="24" class="mb">
          <div class="grid-content">
            <slot name="top"></slot>
          </div>
        </el-col>
        <el-col :span="24" class="fill">
          <slot name="bottom"></slot>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="8">
      <slot name="aside"></slot>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'TwoColumns',
  props: {
  }
};
</script>

