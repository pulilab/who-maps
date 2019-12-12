<template>
  <el-row type="flex" class="matrix-layout" :gutter="gutter">
    <template v-if="!inverse">
      <el-col :span="cols[0]">
        <div class="grid-content">
          <slot name="description"></slot>
        </div>
      </el-col>
      <el-col :span="cols[1]">
        <slot name="image"></slot>
      </el-col>
    </template>
    <template v-else>
      <el-col :span="cols[1]">
        <slot name="image"></slot>
      </el-col>
      <el-col :span="cols[0]">
        <div class="grid-content">
          <slot name="description"></slot>
        </div>
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
    }
  }
};
</script>

