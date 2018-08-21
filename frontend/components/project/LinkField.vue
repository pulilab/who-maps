<template>
  <div class="LinkField">
    <el-input
      :value="value"
      type="text"
      placeholder="http://"
      @change="changeHandler"/>
  </div>
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
  methods: {
    changeHandler (value) {
      this.$emit('change', value);
    }
  }
};
</script>

<style>

</style>
