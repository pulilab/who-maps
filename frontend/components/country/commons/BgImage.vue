<template>
  <div 
    class="grid-content img-center" 
    :style="{backgroundImage: `url(${url})`}" 
  />
</template>

<script>
export default {
  name: 'BgImage',
  props: {
    url: {
      type: String,
      required: true
    }
  },
};
</script>

<style lang="less" scoped>
  .grid-content.img-center {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
