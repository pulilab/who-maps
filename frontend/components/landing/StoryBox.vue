<template>
  <div class="SectionWrapper">
    <div class="StoryWrapper">
      <iframe 
        :src='storyUrl'
        width='100%'
        height='100%' />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storyUrl: this.$gettext('https://stories.digitalhealthatlas.org/embed/1ee36aca-4eaf-4eee-9347-ed29ea01671c?components=[%228APPWPCuo2%22]')
    }
  }
}
</script>

<style lang="less" scoped>
  .SectionWrapper {
    padding: 20px 40px 0 40px;
    .StoryWrapper {
      position: relative;
      padding-bottom: 40%; /* 16:4 aspect ratio */ 
      overflow: hidden;
      iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
        border: 0px none transparent;
        padding: 0px;
        overflow: hidden;
      }
    }
  }

</style>