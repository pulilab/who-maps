<template>
  <div
    class="grid-content img-center"
    :style="{ backgroundImage: `url(${url})` }"
  />
</template>

<script>
export default {
  name: 'WImage',
  props: {
    url: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.grid-content.img-center {
  min-height: 180px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
