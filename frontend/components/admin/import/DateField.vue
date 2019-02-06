<template>
  <el-date-picker
    v-model="internalValue"
    class="ImportDatePicker"
    align="center"
    size="small"
  />
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: null
    }
  },
  computed: {
    internalValue: {
      get () {
        return this.value;
      },
      set (value) {
        this.$emit('change', value.toJSON());
      }
    }
  }
};
</script>

<style lang="less">
  .ImportDatePicker {
    &.el-date-editor {
      width: 200px;
    }
  }
</style>
