<template>
  <div class="FilterItem">
    <el-row>
      <el-col :span="18">
        <div class="Header">
          {{ header }}
        </div>
        <div class="Bottom">
          <el-button
            v-show="!selected"
            type="text">
            Show all
          </el-button>
          <template v-if="selected">
            <span> {{ selected.length }} filter(s) selected </span>
            <el-button type="text">Clear</el-button>
          </template>
        </div>
      </el-col>
      <el-col :span="6">
        <fa
          v-show="active"
          icon="arrow-right"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: null
    }
  }
};
</script>

<style>

</style>
