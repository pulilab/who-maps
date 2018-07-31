<template>
  <div class="LoginComponent">
    <el-card :body-style="{ padding: '0px' }">
      <div slot="header">
        Log in to Digital Health Atlas
      </div>

      <el-form
        ref="loginForm"
        :rules="rules"
        :model="{ username, password }"
        status-icon>
        <fieldset>
          <el-form-item
            label="E-mail"
            prop="username">
            <el-input
              v-model="username"
              type="text" />
          </el-form-item>

          <el-form-item
            label="Password"
            prop="password">
            <el-input
              v-model="password"
              type="password" />

            <!-- General form error for last form element
              (transformed down 14px to fit next to client error) -->
            <div
              v-if="nonFieldErrors"
              class="el-form-item__error ModifiedFormError">{{ nonFieldErrors }}</div>
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
import FormAPIErrorsMixin from './mixins/FormAPIErrorsMixin.js';

export default {
  mixins: [FormAPIErrorsMixin],

  data () {
    return {
      username: '',
      password: '',
      rules: {
        username: [
          { required: true, message: 'This field is required' },
          { type: 'email', message: 'Has to be a valid email address' },
          { validator: this.validatorGenerator('username') }
        ],
        password: [
          { required: true, message: 'This field is required' },
          { validator: this.validatorGenerator('password') }
        ]
      }
    };
  },

  methods: {
    ...mapActions({
      login: 'user/doLogin'
    }),

    loginLocal () {
      this.deleteFormAPIErrors();
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          try {
            await this.login({
              username: this.username,
              password: this.password
            });
            this.$router.push(this.localePath('/'));
          } catch (err) {
            this.setFormAPIErrors(err);
            this.$refs.loginForm.validate(() => {});
          }
        }
      });
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

    .ModifiedFormError {
      transform: translate(0, 14px);
    }
  }
</style>
