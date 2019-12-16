<template>
  <el-row type="flex" :class="`matrix-layout ${classes}`" :gutter="gutter">
    <template v-if="!inverse">
      <el-col :span="cols[0]">
        <el-row class="fill" v-if="$slots.lefttop && $slots.leftbottom">
          <el-col :span="24" class="mb">
            <slot name="lefttop"></slot>
          </el-col>
          <el-col :span="24" class="fill">
            <slot name="leftbottom"></slot>
          </el-col>
        </el-row>
        <el-row class="fill" v-if="$slots.left">
          <el-col :span="24" class="fill">
            <slot name="left"></slot>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="cols[1]">
        <slot name="right"></slot>
      </el-col>
    </template>
    <template v-else>
      <el-col :span="cols[1]">
        <slot name="right"></slot>
      </el-col>
      <el-col :span="cols[0]">
        <el-row class="fill" v-if="$slots.lefttop && $slots.leftbottom">
          <el-col :span="24" class="mb">
            <slot name="lefttop"></slot>
          </el-col>
          <el-col :span="24" class="fill">
            <slot name="leftbottom"></slot>
          </el-col>
        </el-row>
        <slot name="left"></slot>
      </el-col>
    </template>
  </el-row>
</template>

<script>
export default {
  name: 'Default',
  props: {
    inverse: {
      type: Boolean,
      required: false,
      default: false
    },
    cols: {
      type: Array,
      required: false,
      default: () => [16, 8]
    },
    gutter: {
      type: Number,
      required: false,
      default: 0
    },
    classes: {
      type: String,
      required: false,
      default: ''
    }
  }
};
</script>

