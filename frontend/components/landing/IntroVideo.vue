<template>
  <div class="SectionWrapper">
    <h2>Digital Health Atlas Instructional Video</h2>
    <div class="video_wrapper">
      <iframe frameborder="0" width="100%" height="100%" :src="`https://www.youtube.com/embed/${introVideoId}`" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    introVideoId() {
      const translatedId = this.$gettext('overview_video_id')
      return translatedId === 'overview_video_id' ? 'qEFzi0OtJMQ' : translatedId
    }
  }

}
</script>

<style lang="less" scoped>
  @import "../../assets/style/variables.less";

  .SectionWrapper {
    padding: 20px 40px 0 40px;
    h2 {
      background-color: white;
      color: @colorBrandPrimary;
      padding: 40px;
      margin: 0;
    }

    .video_wrapper {
      position: relative;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
    }
    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

</style>
