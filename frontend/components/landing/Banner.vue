<template>
  <div class="BannerWrapper">
    <div class="banner">
      <div class="icon">
        <fa icon="bullhorn" />
      </div>
      <translate>Digital Square has launched its sixth Call for Proposals, inviting digital health innovators to apply for grant funding. Check out the</translate>
      <a href="https://digitalsquare.org/solicitations" target="_blank"><translate>open solicitations</translate></a>.
    </div>  
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
  @import "../../assets/style/variables.less";

  .BannerWrapper {
    padding: 20px 40px 0 40px;
    h2 {
      background-color: white;
      color: @colorBrandPrimary;
      padding: 40px;
      margin: 0;
    }

    .banner {
      display: flex;
      align-items: center;
      height: 60px;
      background-color: #FFFFFF;
      box-shadow: 5px 5px 20px 0 rgba(0,0,0,0.12);
      font-size: @fontSizeMedium;
      a {
        margin-left: 5px;
        color: #1B8EC6;
      }
      .icon {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 25px;
        height: 60px;
        width: 60px;
        color: white;
        background-color: #D56630;
        &::after {
          position: absolute;
          content: '';
          height: 0px;
          width: 0px;
          right: -10px;
          // background-color: #D56630;
          border-top: 14px solid transparent;
          border-bottom: 14px solid transparent;
          border-left: 10px solid #D56630;
        }
        svg {
          height: 25px;
          width: 25px;
        }          
      }
    }
  }
</style>
