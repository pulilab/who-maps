<template>
  <div class="AboutSection">
    <div class="Left">
      <h4>About DHA</h4>
      <p>{{ $store.state.system.landing_page_defaults.permanent_footer }}</p>
    </div>
    <div class="Right">
      <h4>Global Support to DHA</h4>
      <div class="SupporterLogos">

        <div class="Partner">
          <span
            class="PartnerLogo"
            style="background-image: url('/static/partners/who-logo.png')" />
        </div>
        <div class="Partner">
          <span
            class="PartnerLogo"
            style="background-image: url('/static/partners/logo-hrp-new-cropped.png')" />
        </div>
        <div class="Partner">
          <span
            class="PartnerLogo"
            style="background-image: url('/static/partners/logo-path-color.png')" />
        </div>
        <div class="Partner">
          <span
            class="PartnerLogo"
            style="background-image: url('/static/partners/logo-digital_square.png')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="less">
@import "../../assets/style/main.less";

.AboutSection {
  .limitWidthWithPadding();
  height: 300px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;

  .Left {
    width: 300px;
    background-color: lightblue;
    margin-right: 28px;
  }

  .Right {
    flex: 1 0;
    background-color: lightgreen;

    .Partner {
      box-sizing: border-box;
      float: left;
      width: 25%;
      height: 80px;
      margin: 0 0 50px;
      padding: 0 50px 0 0;

      .PartnerLogo {
        float: left;
        display: block;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
      }
    }
  }
}

</style>
