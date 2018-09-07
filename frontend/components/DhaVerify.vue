<template>
  <div class="LoginComponent">
    <el-card :body-style="{ padding: '0px' }">
      <div slot="header">
        Email confirmation
      </div>

      <p class="Instruction">Congratulations your email address is verified, you can now <span @click="toLogin">login</span> and use the system</p>
    </el-card>
  </div>
</template>

<script>
export default {
  methods: {
    toLogin () {
      this.$router.push(this.localePath({name: 'organisation-login', params: this.$route.params}));
    }
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .LoginComponent {
    width: @cardSizeSmall;
    margin: 80px auto;

    .Instruction {
      font-size: 16px;
      line-height: 20px;
      text-align: center;
      color: #6D6D6D;
      padding: 0 80px;

      span {
        cursor: pointer;
        color: @colorBrandPrimary;
      }
    }
  }
</style>
