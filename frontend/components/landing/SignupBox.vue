<template>
  <div class="SingupBox">
    <el-row
      type="flex"
      align="middle"
      class="SignupBoxHeadline">
      <el-col>
        <h2>Sign up</h2>
        <h6>
          Whether you are an implementer, government, or financial investor,<br>
          or technologist, sign up below.
        </h6>
      </el-col>
    </el-row>

    <!-- User type selector -->
    <div v-if="!showForm">
      <el-row
        type="flex"
        align="start"
        justify="space-between"
        class="AccountTypeSelectors">
        <el-col class="mright">
          <div
            :class="['AccountTypeSelector', {'active': accountType === 'I', 'inactive': accountType && accountType !== 'I'}]"
            @click="accountType = 'I'">
            <div class="Introduction">I'm an <br><span>"Implementer"</span></div>
            <div class="TypeDetails">How can I better scale-up my implementation? Are there tips and resources that I should consider to improve my implementation? Sign up to complete the digital version of the MAPS toolkit and track the performance of your implementation.</div>
          </div>
        </el-col>
        <el-col class="mright">
          <div
            :class="['AccountTypeSelector', {'active': accountType === 'D', 'inactive': accountType && accountType !== 'D'}]"
            @click="accountType = 'D'">
            <div class="Introduction">I'm a <br><span>"Financial Investor"</span></div>
            <div class="TypeDetails">What are the different projects within your portfolio? Sign up to access a visual dashboard displaying the performance metrics of projects within your portfolio.</div>
          </div>
        </el-col>
        <el-col>
          <div
            :class="['AccountTypeSelector', {'active': accountType === 'G', 'inactive': accountType && accountType !== 'G'}]"
            @click="accountType = 'G'">
            <div class="Introduction">I work within <br><span>"Government"</span></div>
            <div class="TypeDetails">Who is implementing digital health interventions in your country? Sign up to access interactive maps and performance metrics on the different implementation in your country.</div>
          </div>
        </el-col>
      </el-row>

      <el-row
        type="flex"
        align="start"
        justify="space-between"
        class="NextStepHolder">

        <el-col class="mright"/>
        <el-col class="mright">
          <el-button
            :disabled="!accountType"
            class="NextStepBtn"
            @click="showForm = true">Next step</el-button>
        </el-col>
        <el-col/>

      </el-row>
    </div>

    <!-- Form -->
    <div v-if="showForm">
      FORM
    </div>
  </div>
</template>

<script>
import SignupMixin from '../mixins/SignupMixin.js';

export default {
  mixins: [SignupMixin],

  data () {
    return {
      showForm: false
    };
  }

};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .SingupBox {
    height: 172px;
    text-align: center;
    background-color: @colorWhite;

    .SignupBoxHeadline {
      position: relative;
      height: 100%;

      &::after {
        content: "";
        z-index: 100;
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        display: block;
        width: 0;
        height: 0;
        border-left: 36px solid transparent;
        border-right: 36px solid transparent;
        border-top: 36px solid @colorWhite;
      }

      h2 {
        color: @colorBrandPrimary;
        margin: 0 0 20px;
      }

      h6 {
        color: @colorTextPrimary;
        margin: 0;
      }
    }

    .AccountTypeSelectors {
      padding: 40px 30px 30px;

      .AccountTypeSelector {
        background: white;
        height: 300px;

        &.active {
          transform: scale(1.05);
        }
        &.inactive {
          opacity: 0.8;
        }
      }
    }

    .NextStepHolder {
      padding: 0 30px;

      .NextStepBtn {
        width: 100%;
      }
    }

    .mright {
      margin-right: 20px;
    }
  }
</style>
