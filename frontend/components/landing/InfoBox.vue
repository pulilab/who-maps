<template>
  <div class="InfoBox">
    <img
      class="InfoPicture"
      src="/photo-whyusedha.jpg"
      alt="Why use the Digital Health Atlas">

    <div class="InfoArticle">
      <h3>Why use the Digital Health Atlas?</h3>

      <p>This web platform supports issuing unique IDs for curating the range of digital health products and projects globally. Governments and communities of technologists, implementers, and donors will be equipped to better coordinate and plan, monitor the growth of implementations, and reduce redundancy of investments.</p>

      <p>The Digital Health Atlas (DHA) offers governments, technologists, implementers, and donors a platform of tools and guidance to improve the use of, and planning coordination for digital information systems for health.</p>

      <p>The DHA facilitates implementers to assess the maturity of their digital health implementations, gain personalized guidance, benefit from other’s implementation experiences, and gain access to global resources from leading technical institutions.</p>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .InfoBox {
    .InfoPicture {
      width: 100%;
      height: auto;
    }
    .InfoArticle {
      padding: 20px 40px;

      h3 {
        color: @colorTextPrimary;
        margin: 0 0 20px;
      }

      p {
        font-size: @fontSizeSmall;
        line-height: 18px;
        color: @colorTextPrimary;
      }
    }
  }
</style>
