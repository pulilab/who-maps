<template>
  <div class="LoginComponent">
    <el-card
      v-if="!showForgotten && !successfulReset"
      :body-style="{ padding: '0px' }">
      <div slot="header">
        Log in to Digital Health Atlas
      </div>

      <el-form
        ref="loginForm"
        :rules="rules"
        :model="{ username, password }"
        label-position="top"
        status-icon
        @submit.native.prevent="loginLocal">
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
            <div
              v-if="nonFieldErrors"
              class="el-form-item__error ModifiedFormError">{{ nonFieldErrors }}
            </div>
          </el-form-item>
        </fieldset>

        <div class="CardActionsBottom">
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
            class="cardActions">
            <el-col
              :span="6"
              class="SecondaryAction">
              <el-button
                type="text"
                size="small"
                class="CancelButton"
                @click="toForgotten">
                Forgot password?
              </el-button>
            </el-col>
            <el-col
              :span="6"
              class="PrimaryAction">
              <el-button
                type="primary"
                size="medium"
                native-type="submit">
                Log in
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </el-card>

    <el-card
      v-if="showForgotten"
      :body-style="{ padding: '0px' }">
      <div slot="header">
        Reset forgotten password
      </div>

      <p class="Instruction">Enter your email address and follow the instructions you will get by email.</p>

      <el-form
        ref="forgotForm"
        :rules="rules2"
        :model="{ email }"
        label-position="top"
        status-icon
        @submit.native.prevent="forgotEmail">
        <fieldset>
          <el-form-item
            label="E-mail"
            prop="email">
            <el-input
              v-model="email"
              type="text" />
          </el-form-item>
        </fieldset>

        <div class="CardActionsBottom">
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
            class="cardActions">
            <el-col
              :span="6"
              class="SecondaryAction">
              <el-button
                type="text"
                size="medium"
                @click="showForgotten = false">
                Go back to login
              </el-button>
            </el-col>
            <el-col
              :span="6"
              class="PrimaryAction">
              <el-button
                type="primary"
                size="medium"
                native-type="submit">
                Reset
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </el-card>

    <el-card
      v-if="successfulReset"
      :body-style="{ padding: '0px' }">
      <div slot="header">
        Congratulations!
      </div>

      <p class="Instruction">An email with instructions to reset your password have been sent.</p>

      <div class="CardActionsBottom">
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          class="cardActions">
          <el-col
            :span="6"
            class="SecondaryAction" />
          <el-col
            :span="6"
            class="PrimaryAction">
            <el-button
              type="primary"
              size="medium"
              @click="successfulReset = false">
              Go back to login
            </el-button>
          </el-col>
        </el-row>
      </div>

    </el-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import FormAPIErrorsMixin from './mixins/FormAPIErrorsMixin.js';

export default {
  mixins: [FormAPIErrorsMixin],

  data () {
    return {
      username: '',
      password: '',
      email: '',
      showForgotten: false,
      successfulReset: false,
      rules: {
        username: [
          { required: true, message: 'This field is required', trigger: 'blur' },
          { type: 'email', message: 'Has to be a valid email address', trigger: 'blur' },
          { validator: this.validatorGenerator('username') }
        ],
        password: [
          { required: true, message: 'This field is required', trigger: 'blur' },
          { validator: this.validatorGenerator('password') }
        ]
      },
      rules2: {
        email: [
          { required: true, message: 'This field is required', trigger: 'blur' },
          { type: 'email', message: 'Has to be a valid email address', trigger: 'blur' },
          { validator: this.validatorGenerator('email') }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      profile: 'user/getProfile'
    })
  },
  methods: {
    ...mapActions({
      login: 'user/doLogin',
      resetPassword: 'user/resetPassword',
      setSelectedCountry: 'dashboard/setSelectedCountry'
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
            if (this.profile.country) {
              this.setSelectedCountry(this.profile.country);
            }
            this.$router.push(this.localePath({name: 'organisation-dashboard', params: this.$route.params}));
          } catch (err) {
            this.setFormAPIErrors(err);
            this.$refs.loginForm.validate(() => {});
          }
        }
      });
    },

    toForgotten () {
      this.email = this.username;
      this.showForgotten = true;
    },

    forgotEmail () {
      this.deleteFormAPIErrors();
      this.$refs.forgotForm.validate(async valid => {
        if (valid) {
          try {
            await this.resetPassword({
              email: this.email
            });
            this.showForgotten = false;
            this.successfulReset = true;
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
    margin: 80px auto;

    .Instruction {
      font-size: 16px;
      text-align: center;
      color: #6D6D6D;
      padding: 0 80px;
    }

    fieldset {
      padding: 40px 80px;
    }
  }
</style>
