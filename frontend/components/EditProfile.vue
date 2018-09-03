<template>
  <div class="EditProfile">

    <h1 class="Heading">Edit my profile</h1>

    <el-card
      :body-style="{ padding: '0px' }"
      class="ProfileCard">

      <el-form
        ref="editProfileForm"
        :rules="rules"
        :model="innerProfile"
        label-position="top"
        class="FormPart"
        @submit.native.prevent>
        <el-form-item
          label="My name"
          prop="name">
          <el-input
            v-model="innerProfile.name"
            type="text" />
        </el-form-item>

        <el-form-item
          label="My email address"
          class="is-required">
          <el-input
            v-model="innerProfile.email"
            disabled
            type="text" />
        </el-form-item>

        <el-form-item
          label="Organisation name"
          prop="organisation">
          <organisation-select v-model="innerProfile.organisation" />
        </el-form-item>

        <el-form-item
          label="Site language"
          prop="language">
          <language-select v-model="innerProfile.language" />
        </el-form-item>

        <el-form-item
          label="Country"
          prop="country">
          <country-select v-model="innerProfile.country" />
          <div
            v-if="nonFieldErrors"
            class="el-form-item__error ModifiedFormError">{{ nonFieldErrors }}
          </div>
        </el-form-item>
      </el-form>

      <div v-if="!innerProfile.account_type_approved || changeApprovedUserRole || !['G', 'CA', 'SCA', 'D', 'DA', 'SDA'].includes(innerProfile.account_type)">
        <h4 v-if="!userTypeRequested">I request to be a:</h4>
        <h4 v-if="userTypeRequested">User role requested:</h4>

        <el-checkbox v-model="isCountryUser">Government user</el-checkbox>
        <p class="UserArchTypeText">Lorem ipsum dolor sit amet</p>
        <el-radio-group
          v-if="isCountryUser"
          v-model="innerProfile.account_type"
          :disabled="!isCountryUser">
          <el-radio label="G">Country user</el-radio>
          <p
            v-if="innerProfile.account_type === 'G'"
            class="UserTypeText">Government user explanatory text...</p>
          <br v-else>
          <el-radio label="CA">Administrator of this country</el-radio>
          <p
            v-if="innerProfile.account_type === 'CA'"
            class="UserTypeText">Country admin user explanatory text...</p>
          <br v-else>
          <el-radio label="SCA">Super country administrator</el-radio>
          <p
            v-if="innerProfile.account_type === 'SCA'"
            class="UserTypeText">Super country administrator explanatory text...</p>
          <br v-else>
        </el-radio-group>

        <br>

        <el-checkbox v-model="isDonorUser">Financial investor</el-checkbox>
        <p class="UserArchTypeText">Lorem ipsum dolor sit amet</p>
        <el-radio-group
          v-if="isDonorUser"
          v-model="innerProfile.account_type"
          :disabled="!isDonorUser">
          <el-radio :label="'D'">Donor</el-radio>
          <p
            v-if="innerProfile.account_type === 'D'"
            class="UserTypeText">Donor user explanatory text...</p>
          <br v-else>
          <el-radio :label="'DA'">Donor administrator</el-radio>
          <p
            v-if="innerProfile.account_type === 'DA'"
            class="UserTypeText">Donor administrator explanatory text...</p>
          <br v-else>
          <el-radio :label="'SDA'">Super donor administrator</el-radio>
          <p
            v-if="innerProfile.account_type === 'SDA'"
            class="UserTypeText">Super donor administrator explanatory text...</p>
          <br v-else>
        </el-radio-group>

        <el-form @submit.native.prevent>
          <el-form-item label="Select donor">
            <el-select
              v-if="isDonorUser"
              v-model="innerProfile.donor">
              <el-option
                v-for="don in donors"
                :key="don.value"
                :label="don.label"
                :value="don.value"/>
            </el-select>
          </el-form-item>
        </el-form>

      </div>

      <div v-if="innerProfile.account_type_approved && ['G', 'CA', 'SCA', 'D', 'DA', 'SDA'].includes(innerProfile.account_type) && !changeApprovedUserRole">
        <div>✔ Your user role request has been accepted!</div>

        <div v-if="innerProfile.account_type === 'G'">
          Country User description box
          <el-button @click="changingUserRole">Change</el-button>
        </div>

        <div v-if="innerProfile.account_type === 'CA'">
          Country User Admin description box
          <el-button @click="changingUserRole">Change</el-button>
        </div>

        <div v-if="innerProfile.account_type === 'SCA'">
          Super Country User Admin description box
          <el-button @click="changingUserRole">Change</el-button>
        </div>

        <div v-if="innerProfile.account_type === 'D'">
          Donor description box
          <el-button @click="changingUserRole">Change</el-button>
        </div>

        <div v-if="innerProfile.account_type === 'DA'">
          Donor Admin description box
          <el-button @click="changingUserRole">Change</el-button>
        </div>

        <div v-if="innerProfile.account_type === 'SDA'">
          Super Donor Admin description box
          <el-button @click="changingUserRole">Change</el-button>
        </div>
      </div>

      <div class="Actions">
        <el-button @click="dismissChanges">Dismiss changes</el-button>
        <el-button @click="submit">Save</el-button>
      </div>
    </el-card>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import FormAPIErrorsMixin from './mixins/FormAPIErrorsMixin';
import OrganisationSelect from './common/OrganisationSelect';
import LanguageSelect from './common/LanguageSelect';
import CountrySelect from './common/CountrySelect';

export default {
  components: {
    OrganisationSelect,
    LanguageSelect,
    CountrySelect
  },
  mixins: [FormAPIErrorsMixin],
  data () {
    return {
      innerProfile: {
        name: null,
        organisation: null,
        language: null,
        country: null,
        accountType: null,
        donor: null
      },
      isCountryUser: false,
      isDonorUser: false,
      changeApprovedUserRole: false,
      rules: {
        name: [
          { required: true, message: 'This field is required', trigger: 'change' },
          { validator: this.validatorGenerator('name') }
        ],
        organisation: [
          { required: true, message: 'This field is required', trigger: 'change' },
          { validator: this.validatorGenerator('organisation') }
        ],
        language: [
          { required: true, message: 'This field is required', trigger: 'change' },
          { validator: this.validatorGenerator('language') }
        ],
        country: [
          { required: true, message: 'This field is required', trigger: 'change' },
          { validator: this.validatorGenerator('country') }
        ]
      }
    };
  },

  computed: {
    ...mapGetters({
      profile: 'user/getProfile',
      user: 'user/getUser',
      donors: 'user/getDonors'
    }),

    userTypeRequested () {
      return this.profile.account_type && (
        this.innerProfile.account_type === null ||
        this.innerProfile.account_type === this.profile.account_type
      );
    }
  },

  watch: {
    isCountryUser: function (newVal, oldVal) {
      if (newVal && !oldVal) {
        this.isDonorUser = false;
        if (!['G', 'CA', 'SCA'].includes(this.innerProfile.account_type)) {
          this.innerProfile.account_type = 'G';
        }
      } else if (!newVal && !this.isDonorUser) {
        this.innerProfile.account_type = 'I';
      }
    },
    isDonorUser: function (newVal, oldVal) {
      if (newVal && !oldVal) {
        this.isCountryUser = false;
        if (!['D', 'DA', 'SDA'].includes(this.innerProfile.account_type)) {
          this.innerProfile.account_type = 'D';
        }
      } else if (!newVal && !this.isCountryUser) {
        this.innerProfile.account_type = 'I';
      }
    },
    profile: {
      immediate: true,
      handler (profile) {
        this.innerProfile = {...profile};
      }
    }
  },

  mounted () {
    this.isCountryUser = ['G', 'CA', 'SCA'].includes(this.profile.account_type);
    this.isDonorUser = ['D', 'DA', 'SDA'].includes(this.profile.account_type);
  },

  methods: {
    ...mapActions({
      updateUserProfile: 'user/updateUserProfile'
    }),

    dismissChanges () {
      this.innerProfile = {...this.profile};
    },

    submit () {
      this.deleteFormAPIErrors();
      this.changeApprovedUserRole = false;
      this.$refs.editProfileForm.validate(async valid => {
        if (valid) {
          try {
            await this.updateUserProfile(this.innerProfile);
            window.scrollTo(0, 0);
            this.$message({
              message: 'Profile succesfully updated',
              type: 'success',
              showClose: true
            });
          } catch (err) {
            console.log('ERR:', err);
            this.setFormAPIErrors(err);
            this.$refs.editProfileForm.validate(() => {});
            this.$message({
              message: 'Profile update error',
              type: 'error',
              showClose: true
            });
          }
        }
      });
    },

    changingUserRole () {
      this.changeApprovedUserRole = true;
    }
  }
};
</script>

<style lang="less">

.EditProfile {
  max-width: 560px;
  margin: 0 auto;

  .Heading {
    text-align: center;
    font-size: 32px;
    margin: 48px 0;
  }

  .ProfileCard {
    margin-bottom: 48px;
  }

  .FormPart {
    padding: 60px 100px;
  }

  .full-width {
    width: 100%;
  }

  .LanguageSelector, .CountrySelector {
    width: 100%;
  }

  .Actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding: 15px;
    background-color: gray;
  }

  .UserTypeText {
    height: 15px;
    font-size: 12px;
  }
}
</style>
