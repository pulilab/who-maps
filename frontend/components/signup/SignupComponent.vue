<template>
  <div class="SingupComponent" >

    <div class="Heading">Sign Up</div>

    <el-card>
      <!-- Form -->
      <div v-if="!showSuccess">
        <div class="SubHeading">1. Select your role</div>

        <div class="Type">
          <div
            :class="['AccountTypeSelector', {'active': accountType === 'I', 'inactive': accountType && accountType !== 'I'}]"
            @click="accountType = 'I'">
            <div class="TypeTitle">Implementer or technologist</div>
            <div class="TypeDescription">How can I better scale-up my implementation? Are there tips and resources that I should consider to improve my implementation? Sign up to complete the digital version of the MAPS toolkit and track the performance of your implementation.</div>
          </div>

          <div
            :class="['AccountTypeSelector', {'active': accountType === 'D', 'inactive': accountType && accountType !== 'D'}]"
            @click="accountType = 'D'">
            <div class="TypeTitle">Financial Investor</div>
            <div class="TypeDescription">What are the different projects within your portfolio? Sign up to access a visual dashboard displaying the performance metrics of projects within your portfolio.</div>
          </div>

          <div
            :class="['AccountTypeSelector', {'active': accountType === 'G', 'inactive': accountType && accountType !== 'G'}]"
            @click="accountType = 'G'">
            <div class="TypeTitle">Government</div>
            <div class="TypeDescription">Who is implementing digital health interventions in your country? Sign up to access interactive maps and performance metrics on the different implementation in your country.</div>
          </div>
        </div>

        <div class="Inputs">
          <div class="SubHeading">2. Fill out the form below</div>

          <el-input
            v-model="email"
            placeholder="email"
            type="email" />

          <el-input
            v-model="password"
            placeholder="password"
            type="password" />

          <el-input
            v-model="password2"
            placeholder="password2"
            type="password" />

          <div class="Actions">
            <div class="Left">
              <p>Already signed up?</p>
              <nuxt-link :to="localePath('index-login')">Login here</nuxt-link>
            </div>
            <el-button :disabled="!inputsFilledOkay">Sign up now</el-button>
          </div>

        </div>
      </div>

      <!-- Feedback -->
      <div v-if="showSuccess">
        <p>#User feedback info should be shown here</p>
      </div>

    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showSuccess: false,
      accountType: '',
      email: '',
      password: '',
      password2: ''
    };
  },
  computed: {
    inputsFilledOkay () {
      // eslint-disable-next-line
      const validatorRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      const validEmail = validatorRegex.test(this.email);
      const matchingPasswords = Boolean(this.password === this.password2);

      return this.accountType && this.password && validEmail && matchingPasswords;
    }
  }
};
</script>

<style lang="less">
  .SingupComponent {
    width: 500px;
    margin: 0 auto 48px auto;

    .Heading, .SubHeading {
      text-align: center;
    }

    .Heading {
      font-size: 32px;
      margin: 48px 0;
    }

    .SubHeading {
      text-transform: uppercase;
      font-size: 22px;
      margin: 24px 0;
    }

    .AccountTypeSelector {
      cursor: pointer;
      height: 200px;

      .TypeTitle {
        font-size: 18px;
      }

      .TypeDescription {
        font-size: 14px;
      }

      &.active {
        // active properties
        opacity: 1;
      }

      &.inactive {
        opacity: .6;
      }
    }

    .Actions {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
