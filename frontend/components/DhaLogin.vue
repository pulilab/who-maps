<template>
  <div class="LoginComponent">
    <el-card :body-style="{ padding: '0px' }">
      <div slot="header">
        Log in to Digital Health Atlas
      </div>

      <el-form>
        <fieldset>
          <el-form-item label="Username">
            <el-input
              v-model="username"
              type="text" />
          </el-form-item>

          <el-form-item label="Password">
            <el-input
              v-model="password"

              type="password" />
          </el-form-item>
        </fieldset>

        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          class="cardActions">
          <el-col
            :span="6"
            class="secondaryAction" />
          <el-col
            :span="6"
            class="primaryAction">
            <el-button
              type="primary"
              size="medium"
              @click="loginLocal">
              Log in
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data () {
    return {
      username: '',
      password: ''
    };
  },

  methods: {
    ...mapActions({
      login: 'user/doLogin'
    }),

    async loginLocal () {
      if (this.username && this.password) {
        try {
          await this.login({username: this.username, password: this.password});
          this.$router.push(this.localePath('/'));
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .LoginComponent {
    width: @cardSizeSmall;
    margin: 0 auto;

    fieldset {
      padding: 40px 80px;
    }
  }
</style>
