<template>
  <div class="IntroWrapper">
    <h2>Digital Health Atlas Instructional Video</h2>
    <div class="video_wrapper">
      <iframe frameborder="0" width="100%" height="100%" src="https://www.youtube.com/embed/97wIGZ_YdeM" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
  @import "../../assets/style/variables.less";

  .IntroWrapper {
    padding: 20px 40px 0 40px;
    h2 {
      background-color: white;
      color: @colorBrandPrimary;
      padding: 40px;
      margin: 0;
    }

    .video_wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9, for an aspect ratio of 1:1 change to this value to 100% */ 
    }
    iframe{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    }
  }

</style>
