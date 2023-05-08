<template>
  <div class="Guide">
    <h1>{{ guide.title }}</h1>
    <p>{{ guide.description }}</p>
    <h2>{{ guide.subTitle }}</h2>
    <p>{{ guide.subDescription }}</p>
    <div class="video">
      <div class="video_wrapper">
        <iframe frameborder="0" width="100%" height="100%" :src="`https://www.youtube.com/embed/${guide.videoId}`" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    guide: {
      type: Object,
      required: true
    },
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

.Guide {
  flex: 1;
  overflow: auto;
  padding: 40px 60px;

  .video {
    max-width: 1280px;
    margin: auto;
    .video_wrapper {
      position: relative;
      padding-bottom: 56.25%; /* 16:9, for an aspect ratio of 1:1 change to this value to 100% */
      iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
  }

  h1 {
    color: @colorBrandPrimary;
    font-size: @fontSizeTitle;
  }

  h2 {
    color: @colorBrandPrimary;
    font-size: @fontSizeMedium;
    font-weight: bold;
    letter-spacing: 0.15px;
    line-height: 24px;
    text-transform: uppercase;
  }

  p {
    color: @colorTextPrimary;
    font-size: @fontSizeMedium;
    line-height: 24px;
    letter-spacing: 0.15px;
    word-break: normal;
  }
}
</style>