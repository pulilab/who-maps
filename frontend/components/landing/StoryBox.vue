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
      storyUrl: this.$gettext('https://dha.akuko.io/embed/046f78c1-fd3a-4faf-ae59-1ce4b210930e?components=["RaHZG6UdtX"]')
    }
  }
}
</script>

<style lang="less" scoped>
  .SectionWrapper {
    padding: 20px 40px 0 40px;
    .StoryWrapper {
      position: relative;
      overflow: hidden;
      height: 870px;
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