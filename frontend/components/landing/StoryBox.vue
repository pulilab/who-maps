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
      storyUrl: this.$gettext('https://dha.akuko.io/embed/046f78c1-fd3a-4faf-ae59-1ce4b210930e?components=["XfYZ9d3lKr","v56rTWY0hX"]')
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