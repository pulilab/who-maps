<template>
  <div class="SingupComponent">
    <el-card
      :shadow="shadow"
      :body-style="{ padding: '0px' }"
    >
      <div slot="header">
        <template v-if="token">
          <translate>Set your password</translate>
        </template>
        <template v-else>
          <translate>Sign up for Digital Health Atlas</translate>
        </template>
      </div>
      <el-form
        ref="form"
        :model="signupForm"
        :rules="rules"
        label-position="top"
        @submit.native.prevent="submitForm"
      >
        <fieldset>
          <div class="FieldsetLegend">
            <translate>Please fill out the form below:</translate>
          </div>
          <el-form-item
            v-if="!token"
            :label="$gettext('Email address') | translate"
            prop="email"
          >
            <el-input
              id="email"
              v-model="signupForm.email"
            />
          </el-form-item>

          <el-form-item
            :label="$gettext('Password') | translate"
            prop="password1"
          >
            <el-input
              id="password"
              v-model="signupForm.password1"
              type="password"
            />
          </el-form-item>

          <el-form-item
            :label="$gettext('Password (again)') | translate"
            prop="password2"
          >
            <el-input
              id="passwordAgain"
              v-model="signupForm.password2"
              type="password"
            />
            <div
              v-if="nonFieldErrors"
              class="el-form-item__error ModifiedFormError"
            >
              <br>
              {{ nonFieldErrors }}
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
              class="SecondaryAction LoginLink"
            >
              <h6><translate>Already signed up?</translate></h6>
              <nuxt-link
                :to="
                  localePath({
                    name: 'organisation-login',
                    params: $route.params
                  })
                "
                class="NuxtLink Small"
              >
                <span><translate>Login here</translate></span>
              </nuxt-link>
            </el-col>
            <el-col
              :span="12"
              class="PrimaryAction"
            >
              <el-button
                size="medium"
                native-type="submit"
                class="el-button--accent"
              >
                <translate v-if="token">
                  Set Password
                </translate>
                <translate v-else>
                  Sign up now
                </translate>
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import FormAPIErrorsMixin from '~/components/mixins/FormAPIErrorsMixin'

export default {
  mixins: [FormAPIErrorsMixin],
  props: {
    shadow: {
      type: String,
      default: 'always'
    },
    token: {
      type: String,
      default: '',
      required: false
    },
    uid: {
      type: String,
      default: '',
      required: false
    },
    type: {
      type: String,
      default: '',
      required: false
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
        email: (() => {
          return this.token
            ? []
            : [
              {
                required: true,
                message: this.$gettext('This field is required'),
                trigger: 'blur'
              },
              {
                type: 'email',
                message: this.$gettext('Has to be a valid email address'),
                trigger: 'blur'
              },
              { validator: this.validatorGenerator('email'), trigger: 'blur' }
            ]
        })(),
        password1: [
          {
            required: true,
            message: this.$gettext('This field is required'),
            trigger: 'blur'
          },
          {
            min: 8,
            message: this.$gettext(
              'This field should be at least 8 characters'
            ),
            trigger: 'blur'
          },
          { validator: this.validatorGenerator('password1'), trigger: 'blur' }
        ],
        password2: [
          {
            required: true,
            message: this.$gettext('This field is required'),
            trigger: 'blur'
          },
          { validator: this.passwordMatching, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions({
      doSignup: 'user/signup',
      dorResetPassword: 'user/dorResetPassword'
    }),
    passwordMatching (rule, value, callback) {
      value === this.signupForm.password1
        ? callback()
        : callback(Error(this.$gettext('The password must match')))
    },
    submitForm () {
      this.token ? this.resetPassword() : this.signup()
    },
    signup () {
      return this.setForm({
        message: this.$gettext('User created succesfully'),
        apiCall: () =>
          this.doSignup({
            account_type: 'I',
            password1: this.signupForm.password1,
            password2: this.signupForm.password2,
            email: this.signupForm.email
          }),
        pathName: 'organisation-edit-profile'
      })
    },
    resetPassword () {
      return this.setForm({
        message: this.$gettext('Your password was reset successfully'),
        apiCall: () =>
          this.dorResetPassword({
            new_password1: this.signupForm.password1,
            new_password2: this.signupForm.password2,
            uid: this.uid,
            token: this.token,
            errMessage: this.$gettext(
              'The password reset link was invalid, possibly because it has already been used. Please request a new password reset.'
            )
          }),
        pathName: 'organisation-login'
      })
    },
    setForm ({ message, apiCall, pathName }) {
      this.deleteFormAPIErrors()
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            // locale needs to be saved in this place due to i18n being unavailable right after the signup call
            this.$nuxt.$loading.start()
            await apiCall()
            const locale = this.$i18n.locale
            const query = { ...this.$route.query }
            const path = query?.type === 'reset'
              ? this.localePath({ name: 'organisation-login', }, locale)
              : this.localePath({ ...this.$route, name: pathName }, locale)
            this.$router.push(path)
            this.$message({
              message,
              type: 'success',
              showClose: true
            })
          } catch (e) {
            console.log(e)
            this.$nuxt.$loading.finish()
            this.setFormAPIErrors(e)
            this.$refs.form.validate(() => {})
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
@import "../assets/style/variables.less";
@import "../assets/style/mixins.less";

.SingupComponent {
  width: @cardSizeSmall;
  min-height: calc(
    100vh - @topBarHeight - @actionBarHeight - @appFooterHeight - 160px
  );
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
