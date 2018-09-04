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
        label-position="top"
        status-icon
        @submit.native.prevent="loginLocal"
      >
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
              class="SecondaryAction" />
            <el-col
              :span="6"
              class="PrimaryAction">
              <el-button
                type="primary"
                size="medium"
                native-type="submit"
              >
                Log in
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
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

    fieldset {
      padding: 40px 80px;
    }
  }
</style>
