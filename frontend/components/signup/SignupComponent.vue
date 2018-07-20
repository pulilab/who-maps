<template>
  <div class="SingupComponent">
    <el-card :body-style="{ padding: '0px' }">
      <div slot="header">
        Sign up for Digital Health Atlas
      </div>
      <!-- Form -->
      <div
        v-if="!showSuccess"
        class="Roles">
        <fieldset class="Type">
          <div class="Legend">1. Select your role</div>
          <!-- TODO -->
          <!-- Add class '.active' one of these initially -->
          <div
            :class="['AccountTypeSelector', {'active': accountType === 'I', 'inactive': accountType && accountType !== 'I'}]"
            @click="accountType = 'I'">
            <div class="CheckboxRole">
              <span class="IconRole">
                <img src="/icon-role-implementer.svg">
              </span>
              <i class="el-icon-circle-check-outline"/>
              <i class="el-icon-circle-check"/>
              <div class="TypeTitle">I'm an <b>Implementer <span>or</span> Technologist</b></div>
            </div>
            <div class="TypeDescription">How can I better scale-up my implementation? Are there tips and resources that I should consider to improve my implementation? Sign up to complete the digital version of the MAPS toolkit and track the performance of your implementation.</div>
          </div>

          <div
            :class="['AccountTypeSelector', {'active': accountType === 'D', 'inactive': accountType && accountType !== 'D'}]"
            @click="accountType = 'D'">
            <div class="CheckboxRole">
              <span class="IconRole">
                <img src="/icon-role-investor.svg">
              </span>
              <i class="el-icon-circle-check-outline"/>
              <i class="el-icon-circle-check"/>
              <div class="TypeTitle">I'm a <b>Financial Investor</b></div>
            </div>
            <!-- FYI: In next line @col97: Irregular whitespace was found by linter in the translateable text, it was corrected, but... -->
            <div class="TypeDescription">What are the different projects within your portfolio? Sign up to access a visual dashboard displaying the performance metrics of projects within your portfolio.</div>
          </div>

          <div
            :class="['AccountTypeSelector', {'active': accountType === 'G', 'inactive': accountType && accountType !== 'G'}]"
            @click="accountType = 'G'">
            <div class="CheckboxRole">
              <span class="IconRole">
                <img src="/icon-role-government.svg">
              </span>
              <i class="el-icon-circle-check-outline"/>
              <i class="el-icon-circle-check"/>
              <div class="TypeTitle">I work within <b>Government</b></div>
            </div>
            <div class="TypeDescription">Who is implementing digital health interventions in your country? Sign up to access interactive maps and performance metrics on the different implementation in your country.</div>
          </div>
        </fieldset>

        <fieldset class="Inputs">
          <div class="Legend">2. Fill out the form below</div>

          <el-form
            :model="signupForm"
            @submit.native.prevent>

            <el-form-item label="Email address">
              <el-input
                v-model="signupForm.email"
                type="email" />
            </el-form-item>

            <el-form-item label="Password">
              <el-input
                v-model="signupForm.password"
                type="password" />
            </el-form-item>

            <el-form-item label="Password (Again)">
              <el-input
                v-model="signupForm.password2"
                type="password" />
            </el-form-item>
          </el-form>
        </fieldset>
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          class="cardActions">
          <el-col
            :span="6"
            class="secondaryAction">
            <h6>Already signed up?</h6>
            <nuxt-link :to="localePath('index-login')">Login here</nuxt-link>
          </el-col>
          <el-col
            :span="6"
            class="primaryAction">
            <el-button
              :disabled="!inputsFilledOkay"
              type="primary"
              size="medium"
              @click="signup">
              Sign up now
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- <translate>This is required</translate>
      <translate>This should be a valid email</translate>
      <translate>Your passwords do not match.</translate>
      <translate>This need to be at least 6 chars</translate>
      ng-repeat="error in signupForm.password1.customError"
      ng-repeat="error in signupForm.email.customError" -->

      <!-- Feedback -->
      <div v-if="showSuccess">
        <!-- Translated -->
        <h4>Go to next step</h4>
        <p>Your registration is successful, you will receive an email with the instructions to activate your account, you will be automatically logged in in 5 seconds...</p>
      </div>

    </el-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {

  data () {
    return {
      showSuccess: false,
      accountType: '',
      signupForm: {
        email: '',
        password: '',
        password2: ''
      }
    };
  },

  computed: {
    inputsFilledOkay () {
      // eslint-disable-next-line
      const validatorRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      const validEmail = validatorRegex.test(this.signupForm.email);
      const matchingPasswords = Boolean(this.signupForm.password === this.signupForm.password2);

      return this.accountType && this.signupForm.password && validEmail && matchingPasswords;
    }
  },

  methods: {
    ...mapActions({
      'doSignup': 'user/doSignup'
    }),

    async signup () {
      await this.doSignup({
        account_type: this.accountType,
        password1: this.signupForm.password,
        password2: this.signupForm.password2,
        email: this.signupForm.email
      });
      this.showSuccess = true;
      setTimeout(() => {
        this.$router.push(this.localePath('index-edit-profile'));
      }, 5000);
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .SingupComponent {
    width: @cardSizeSmall;
    margin: 0 auto;

    fieldset {
      padding: 40px 80px;
      border-bottom: 1px solid @colorGrayLighter;
      .clearfix();

      &:last-of-type {
        border: 0;
      }
    }

    .AccountTypeSelector {
      float: left;
      margin: 10px 0 30px;
      cursor: pointer;
      transition: @transitionFade;

      &:last-of-type {
        margin: 0;
      }

      .CheckboxRole {
        position: relative;
      }

      .TypeTitle {
        font-size: @fontSizeMedium;
        margin: 0 0 20px 80px;

        b span {
          font-weight: 400;
        }
      }

      .TypeDescription {
        font-size: @fontSizeSmall;
        line-height: 18px;
        color: @colorTextSecondary;
      }

      .IconRole {
        position: absolute;
        top: 50%;
        left: 30px;
        display: inline-block;
        transform: translateY(-50%);

        img {
          -webkit-filter: grayscale(1);
          filter: grayscale(1);
        }
      }

      i {
        position: absolute;
        top: 0;
        left: 0;
        transition: @transitionFade;

        &.el-icon-circle-check-outline {
          z-index: 1;
          opacity: 1;
          color: @colorGrayLight;
        }

        &.el-icon-circle-check {
          z-index: 2;
          opacity: 0;
          color: @colorBrandPrimary;
        }
      }

      &.active {
        opacity: 1;

        .el-icon-circle-check-outline {
          opacity: 0;
        }

        .el-icon-circle-check {
          opacity: 1;
        }

        .IconRole img {
          -webkit-filter: grayscale(0);
          filter: grayscale(0);
        }
      }

      &.inactive {
        opacity: .6;
      }
    }

    .cardActions {
      .secondaryAction {
        h6 {
          margin: 0 0 2px;
          font-size: @fontSizeSmall;
          font-weight: 400;
          color: @colorTextSecondary;
        }

        a {
          font-size: @fontSizeSmall;
          font-weight: 700;
          color: @colorBrandPrimary;
        }
      }
    }
  }
</style>
