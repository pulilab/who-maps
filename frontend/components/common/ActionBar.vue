<template>
  <div class="ActionBar">
    <div class="InnerActionBar">
      <div class="Title">Digital Health Atlas</div>

      <search-component />
    </div>
  </div>
</template>

<script>
import SearchComponent from '../common/SearchComponent.vue';

export default {
  components: {
    SearchComponent
  }
};
</script>

<style lang="less">
@import "../../assets/style/main.less";

.ActionBar {
  background-color: lightblue;

  .InnerActionBar {
    .limitWidthWithPadding();

    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  // .Title {}
}
</style>
