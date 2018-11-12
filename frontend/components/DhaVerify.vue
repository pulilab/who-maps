<template>
  <div class="LoginComponent">
    <el-card :body-style="{ padding: '0px' }">
      <div slot="header">
        <translate>Email confirmation</translate>
      </div>

      <p
        v-if="emailVerifiedRecently"
        class="Instruction">
        <translate>Congratulations your email address is verified, you can now </translate>
        <span>&nbsp;</span>
        <span
          class="TextLink"
          @click="toLogin">
          <translate>login</translate>
        </span>
        <span>&nbsp;</span>
        <translate>and use the system</translate>
      </p>

      <p
        v-if="!emailVerifiedRecently"
        class="Instruction">
        <translate>Something went wrong! Are you sure you didn't verified this email address already? You can</translate>
        <span>&nbsp;</span>
        <span
          class="TextLink"
          @click="toLogin">
          <translate>log in</translate>
        </span>
        <span>&nbsp;</span>
        <translate>with your creadentials.</translate>
      </p>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      emailVerifiedRecently: 'user/emailVerifiedRecently'
    })
  },

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
      font-size: @fontSizeMedium;
      line-height: 24px;
      text-align: center;
      color: @colorTextPrimary;
      padding: 0 80px;

      .TextLink {
        cursor: pointer;
        color: @colorBrandPrimary;
      }
    }
  }
</style>
