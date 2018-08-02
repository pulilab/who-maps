<template>
  <div class="WorldZoomButton">
    <el-button
      type="danger"
      icon="el-icon-zoom-out"
      circle
      @click="zoomToWorld"
    />
  </div>
</template>

<script>
export default {
  methods: {
    zoomToWorld () {
      this.$root.$emit('map:zoom-at', 3);
    }
  }
};
</script>

<style lang="less">
  .WorldZoomButton {
    position: absolute;
    z-index: 1010;
    right: 34px;
    bottom: 120px;
  }
</style>
