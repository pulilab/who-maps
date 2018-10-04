<template>
  <div class="SingupComponent">
    <el-card
      :shadow="shadow"
      :body-style="{ padding: '0px' }"
    >
      <div slot="header">
        <translate>Sign up for Digital Health Atlas</translate>
      </div>
      <el-form
        ref="signupForm"
        :model="signupForm"
        :rules="rules"
        label-position="top"
        @submit.native.prevent="signup"
      >
        <fieldset>
          <div class="FieldsetLegend"><translate>Please fill out the form below:</translate></div>
          <el-form-item
            :label="$gettext('Email address')"
            prop="email">
            <el-input
              v-model="signupForm.email"
              type="email" />
          </el-form-item>

          <el-form-item
            :label="$gettext('Password')"
            prop="password1">
            <el-input
              v-model="signupForm.password1"
              type="password" />
          </el-form-item>

          <el-form-item
            :label="$gettext('Password (again)')"
            prop="password2">
            <el-input
              v-model="signupForm.password2"
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
          >
            <el-col
              :span="12"
              class="SecondaryAction LoginLink">
              <h6><translate>Already signed up?</translate></h6>
              <nuxt-link
                :to="localePath({name: 'organisation-login', params: $route.params})"
                class="NuxtLink Small IconRight"
              >
                <span><translate>Login here</translate></span><fa icon="angle-right" />
              </nuxt-link>
            </el-col>
            <el-col
              :span="12"
              class="PrimaryAction">
              <el-button
                type="primary"
                size="medium"
                native-type="submit">
                <translate>Sign up now</translate>
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import FormAPIErrorsMixin from './mixins/FormAPIErrorsMixin';

export default {
  mixins: [FormAPIErrorsMixin],
  props: {
    shadow: {
      type: String,
      default: 'always'
    }
  },
  data () {
    return {
      signupForm: {
        email: '',
        password1: '',
        password2: ''
      },
      rules: {
        email: [
          { required: true, message: this.$gettext('This field is required'), trigger: 'blur' },
          { type: 'email', message: this.$gettext('Has to be a valid email address'), trigger: 'blur' },
          { validator: this.validatorGenerator('email'), trigger: 'blur' }
        ],
        password1: [
          { required: true, message: this.$gettext('This field is required'), trigger: 'blur' },
          { min: 8, message: this.$gettext('This field should be at least 8 characters'), trigger: 'blur' },
          { validator: this.validatorGenerator('password1'), trigger: 'blur' }
        ],
        password2: [
          { required: true, message: this.$gettext('This field is required'), trigger: 'blur' },
          { validator: this.passwordMatching, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    ...mapActions({
      'doSignup': 'user/doSignup'
    }),
    passwordMatching (rule, value, callback) {
      value === this.signupForm.password1 ? callback() : callback(Error(this.$gettext('The password must match')));
    },
    async signup () {
      this.deleteFormAPIErrors();
      this.$refs.signupForm.validate(async valid => {
        if (valid) {
          try {
            this.$nuxt.$loading.start();
            await this.doSignup({
              account_type: 'I',
              password1: this.signupForm.password1,
              password2: this.signupForm.password2,
              email: this.signupForm.email
            });
            this.$router.push(this.localePath({name: 'organisation-edit-profile', params: this.$route.params}));
            this.$message({
              message: this.$gettext('User created succesfully'),
              type: 'success',
              showClose: true
            });
          } catch (e) {
            this.$nuxt.$loading.finish();
            this.setFormAPIErrors(e);
            this.$refs.signupForm.validate(() => {});
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

  .SingupComponent {
    width: @cardSizeSmall;
    margin: 80px auto;

    fieldset {
      padding: 40px 80px;
    }

    .SecondaryAction {
      h6 {
        margin: 0 0 2px;
        font-size: @fontSizeSmall;
        font-weight: 400;
        color: @colorTextSecondary;
      }
    }
  }
</style>
