<template>
  <el-row :gutter="20" type="flex" class="matrix-layout">
    <el-col :span="8">
      <el-row class="fill">
        <el-col :span="24" class="mb" v-if="$slots.lefttop">
          <slot name="lefttop">
            <slot></slot>
          </slot>
        </el-col>
        <el-col :span="24" class="fill" v-if="$slots.leftbottom">
          <slot name="leftbottom"></slot>
        </el-col>
        <el-col :span="24" class="fill" v-if="$slots.left">
          <slot name="left" v-if="$slots.left"></slot>
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

