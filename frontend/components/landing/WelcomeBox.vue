<template>
  <div class="WelcomeBox-holder">
    <div
      v-show="visible"
      class="WelcomeBox">

      <h2>Welcome!</h2>
      <h5>{{ $store.state.system.landing_page_defaults.cover_text }}</h5>

      <button @click="closeWelcomeBox">
        <i class="el-icon-close" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: true
    };
  },
  methods: {
    closeWelcomeBox () {
      this.visible = false;
    }
  }
};
</script>

<style lang="less">
@import "../../assets/style/main.less";

.WelcomeBox-holder {
  .limitWidthWithPadding ();

  .WelcomeBox {
    height: 300px;
    width: 300px;
    background-color: blue;
  }
}
</style>
