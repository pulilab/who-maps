<template>
  <el-row
    :gutter="20"
    type="flex"
    class="matrix-layout"
  >
    <el-col :span="8">
      <el-row class="fill">
        <el-col
          v-if="$slots.lefttop"
          :span="24"
          class="mb"
        >
          <slot name="lefttop">
            <slot />
          </slot>
        </el-col>
        <el-col
          v-if="$slots.leftbottom"
          :span="24"
          class="fill"
        >
          <slot name="leftbottom" />
        </el-col>
        <el-col
          v-if="$slots.left"
          :span="24"
          class="fill"
        >
          <slot
            v-if="$slots.left"
            name="left"
          />
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="8">
      <slot name="middle" />
    </el-col>
    <el-col :span="8">
      <slot name="right" />
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'ThreeColumns',
  props: {
  }
}
</script>
