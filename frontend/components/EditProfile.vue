<template>
  <div class="EditProfile">

    <h1 class="Heading">Edit my profile</h1>

    <el-card
      :body-style="{ padding: '0px' }"
      class="ProfileCard">

      <el-form
        ref="editProfileForm"
        :rules="rules"
        :model="{ name, organisation, language, country }"
        label-position="top"
        class="FormPart"
        @submit.native.prevent>
        <el-form-item
          label="My name"
          prop="name">
          <el-input
            v-model="name"
            type="text" />
        </el-form-item>

        <el-form-item
          label="My email address"
          class="is-required">
          <el-input
            v-model="profile.email"
            disabled
            type="text" />
        </el-form-item>

        <el-form-item
          label="Organisation name"
          prop="organisation">
          <el-autocomplete
            v-model="organisation"
            :fetch-suggestions="orgSuggestions"
            class="full-width" />
        </el-form-item>

        <p v-if="newOrganisation">You're about to make a new organisation. Are you sure you can't find the one you were looking for?</p>
        <el-button
          v-if="newOrganisation"
          @click="addOrganisation(organisation)">Make new organisation: {{ organisation }}</el-button>

        <el-form-item
          label="Site language"
          prop="language">
          <el-select
            v-model="language"
            class="full-width">
            <el-option
              v-for="lng in languages"
              :key="lng.name"
              :label="lng.name"
              :value="lng.code" />
          </el-select>
        </el-form-item>

        <el-form-item
          label="Country"
          prop="country">
          <el-select
            v-model="country"
            class="full-width">
            <el-option
              v-for="ctr in countries"
              :key="ctr.id"
              :label="ctr.name"
              :value="ctr.id" />
          </el-select>
          <div
            v-if="nonFieldErrors"
            class="el-form-item__error ModifiedFormError">{{ nonFieldErrors }}
          </div>
        </el-form-item>
      </el-form>

      <div v-if="!userTypeApproved || changeApprovedUserRole || !['G', 'CA', 'SCA', 'D', 'DA', 'SDA'].includes(accountType)">
        <h4 v-if="!userTypeRequested">I request to be a:</h4>
        <h4 v-if="userTypeRequested">User role requested:</h4>

        <el-checkbox v-model="isCountryUser">Government user</el-checkbox>
        <p class="UserArchTypeText">Lorem ipsum dolor sit amet</p>
        <el-radio-group
          v-if="isCountryUser"
          v-model="accountType"
          :disabled="!isCountryUser">
          <el-radio :label="'G'">Country user</el-radio>
          <p
            v-if="accountType === 'G'"
            class="UserTypeText">Government user explanatory text...</p>
          <br v-else>
          <el-radio :label="'CA'">Administrator of this country</el-radio>
          <p
            v-if="accountType === 'CA'"
            class="UserTypeText">Country admin user explanatory text...</p>
          <br v-else>
          <el-radio :label="'SCA'">Super country administrator</el-radio>
          <p
            v-if="accountType === 'SCA'"
            class="UserTypeText">Super country administrator explanatory text...</p>
          <br v-else>
        </el-radio-group>

        <br>

        <el-checkbox v-model="isDonorUser">Financial investor</el-checkbox>
        <p class="UserArchTypeText">Lorem ipsum dolor sit amet</p>
        <el-radio-group
          v-if="isDonorUser"
          v-model="accountType"
          :disabled="!isDonorUser">
          <el-radio :label="'D'">Donor</el-radio>
          <p
            v-if="accountType === 'D'"
            class="UserTypeText">Donor user explanatory text...</p>
          <br v-else>
          <el-radio :label="'DA'">Donor administrator</el-radio>
          <p
            v-if="accountType === 'DA'"
            class="UserTypeText">Donor administrator explanatory text...</p>
          <br v-else>
          <el-radio :label="'SDA'">Super donor administrator</el-radio>
          <p
            v-if="accountType === 'SDA'"
            class="UserTypeText">Super donor administrator explanatory text...</p>
          <br v-else>
        </el-radio-group>

        <el-form @submit.native.prevent>
          <el-form-item label="Select donor">
            <el-select
              v-if="isDonorUser"
              v-model="donor">
              <el-option
                v-for="don in donors"
                :key="don.value"
                :label="don.label"
                :value="don.value"/>
            </el-select>
          </el-form-item>
        </el-form>

      </div>

      <div v-if="userTypeApproved && ['G', 'CA', 'SCA', 'D', 'DA', 'SDA'].includes(accountType) && !changeApprovedUserRole">
        <div>✔ Your user role request has been accepted!</div>

        <div v-if="accountType === 'G'">
          Country User description box
          <el-button @click="changingUserRole">Change</el-button>
        </div>

        <div v-if="accountType === 'CA'">
          Country User Admin description box
          <el-button @click="changingUserRole">Change</el-button>
        </div>

        <div v-if="accountType === 'SCA'">
          Super Country User Admin description box
          <el-button @click="changingUserRole">Change</el-button>
        </div>

        <div v-if="accountType === 'D'">
          Donor description box
          <el-button @click="changingUserRole">Change</el-button>
        </div>

        <div v-if="accountType === 'DA'">
          Donor Admin description box
          <el-button @click="changingUserRole">Change</el-button>
        </div>

        <div v-if="accountType === 'SDA'">
          Super Donor Admin description box
          <el-button @click="changingUserRole">Change</el-button>
        </div>
      </div>

      <div class="Actions">
        <el-button @click="dismissChanges">Dismiss changes</el-button>
        <el-button @click="validateSubmitAndMapApiErrors">Save</el-button>
      </div>
    </el-card>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import FormAPIErrorsMixin from './mixins/FormAPIErrorsMixin';

export default {
  mixins: [FormAPIErrorsMixin],

  data () {
    return {
      innerProfile: {
        name: null,
        organisation: null,
        language: null,
        country: null,
        accountType: null
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
      organisations: 'system/getOrganisations',
      languages: 'system/getLanguages',
      countries: 'countries/getCountries',
      donors: 'user/getDonors'
    }),

    newOrganisation () {
      return this.organisation && !this.organisations.find(org => org.name === this.organisation);
    },

    name: {
      get () {
        return this.innerProfile.name || this.profile.name;
      },
      set (value) {
        this.innerProfile.name = value;
      }
    },

    organisation: {
      get () {
        if (this.innerProfile.organisation !== null) {
          return this.innerProfile.organisation;
        } else {
          const mappedOrg = this.organisations.find(org => +org.id === +this.profile.organisation);
          return mappedOrg && mappedOrg.name;
        }
      },
      set (value) {
        this.innerProfile.organisation = value;
      }
    },

    country: {
      get () {
        return this.innerProfile.country !== null ? this.innerProfile.country : this.profile.country;
      },
      set (value) {
        this.innerProfile.country = value;
      }
    },

    language: {
      get () {
        return this.innerProfile.language !== null ? this.innerProfile.language : this.profile.language;
      },
      set (value) {
        this.innerProfile.language = value;
      }
    },

    accountType: {
      get () {
        return this.innerProfile.accountType !== null ? this.innerProfile.accountType : this.profile.account_type;
      },
      set (value) {
        this.innerProfile.accountType = value;
      }
    },

    donor: {
      get () {
        return this.innerProfile.donor !== null ? this.innerProfile.donor : this.profile.donor;
      },
      set (value) {
        this.innerProfile.donor = value;
      }
    },

    userTypeRequested () {
      return this.profile.account_type && (
        this.innerProfile.accountType === null ||
        this.innerProfile.accountType === this.profile.account_type
      );
    },

    userTypeApproved () {
      return this.profile && this.profile.account_type_approved;
    }
  },

  watch: {
    isCountryUser: function (newVal, oldVal) {
      if (newVal && !oldVal) {
        this.isDonorUser = false;
        if (!['G', 'CA', 'SCA'].includes(this.accountType)) {
          this.innerProfile.accountType = 'G';
        }
      } else if (!newVal && !this.isDonorUser) {
        this.innerProfile.accountType = 'I';
      }
    },
    isDonorUser: function (newVal, oldVal) {
      if (newVal && !oldVal) {
        this.isCountryUser = false;
        if (!['D', 'DA', 'SDA'].includes(this.accountType)) {
          this.innerProfile.accountType = 'D';
        }
      } else if (!newVal && !this.isCountryUser) {
        this.innerProfile.accountType = 'I';
      }
    }
  },

  mounted () {
    this.isCountryUser = ['G', 'CA', 'SCA'].includes(this.profile.account_type);
    this.isDonorUser = ['D', 'DA', 'SDA'].includes(this.profile.account_type);
  },

  methods: {
    ...mapActions({
      addOrganisation: 'system/addOrganisation',
      updateUserProfile: 'user/updateUserProfile'
    }),

    dismissChanges () {
      this.innerProfile.name = null;
      this.innerProfile.organisation = null;
      this.innerProfile.country = null;
      this.innerProfile.language = null;
    },

    orgSuggestions (queryStr, cb) {
      if (queryStr) {
        const filtered = this.organisations
          .map(org => ({value: org.name, id: org.id}))
          .filter(org => org.value.toLowerCase().includes(queryStr.toLowerCase()));

        cb(filtered);
      } else {
        cb(this.organisations.map(org => ({value: org.name, id: org.id})));
      }
    },

    async mapDataAndUpdate () {
      const putObj = ['name', 'country', 'language', 'donor'].reduce((ret, key) => {
        if (this.innerProfile[key] !== null && this.innerProfile[key] !== this.profile.key) {
          ret[key] = this.innerProfile[key];
        } else {
          ret[key] = this.profile[key];
        }
        return ret;
      }, {});

      if (this.innerProfile.organisation === null) {
        putObj.organisation = this.profile.organisation;
      } else {
        putObj.organisation = this.organisations.find(el => el.name === this.innerProfile.organisation).id;
      }

      if (this.innerProfile.accountType === null) {
        putObj.account_type = this.profile.account_type;
      } else {
        putObj.account_type = this.innerProfile.accountType;
      }

      try {
        await this.updateUserProfile(putObj);
        window.scrollTo(0, 0);
        this.$message({
          message: 'Profile succesfully updated',
          type: 'success',
          showClose: true
        });
      } catch (e) {
        console.error(e);
        this.$message({
          message: 'Profile update error',
          type: 'error',
          showClose: true
        });
      }
    },

    validateSubmitAndMapApiErrors () {
      this.deleteFormAPIErrors();
      this.changeApprovedUserRole = false;
      this.$refs.editProfileForm.validate(async valid => {
        if (valid) {
          try {
            await this.mapDataAndUpdate();
          } catch (err) {
            console.log('ERR:', err);
            this.setFormAPIErrors(err);
            this.$refs.editProfileForm.validate(() => {});
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
