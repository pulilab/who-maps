<template>
  <el-row type="flex" :class="`matrix-layout ${classes}`" :gutter="gutter">
    <template v-if="!inverse">
      <el-col :span="cols[0]">
        <el-row v-if="$slots.lefttop && $slots.leftbottom" class="fill">
          <el-col :span="24" class="mb">
            <slot name="lefttop" />
          </el-col>
          <el-col :span="24" class="fill">
            <slot name="leftbottom" />
          </el-col>
        </el-row>
        <el-row v-if="$slots.left" class="fill">
          <el-col :span="24" class="fill">
            <slot name="left" />
          </el-col>
        </el-row>
      </el-col>
      <el-col v-if="colNum > 1" :span="cols[1]">
        <slot name="right" />
      </el-col>
    </template>
    <template v-else>
      <el-col v-if="colNum > 1" :span="cols[1]">
        <slot name="right" />
      </el-col>
      <el-col :span="cols[0]">
        <el-row v-if="$slots.lefttop && $slots.leftbottom" class="fill">
          <el-col :span="24" class="mb">
            <slot name="lefttop" />
          </el-col>
          <el-col :span="24" class="fill">
            <slot name="leftbottom" />
          </el-col>
        </el-row>
        <slot name="left" />
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
  },
  computed: {
    colNum() {
      return this.cols.length
    }
  }
}
</script>
