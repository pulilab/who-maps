<template>
  <div class="EditProfile">
    <div class="PageTitle">
      <h2>Edit my profile</h2>
    </div>

    <el-card
      :body-style="{ padding: '0px' }"
      class="ProfileCard">

      <el-row type="flex">
        <el-col
          :span="12"
          class="UserForm">
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
              label="Country"
              prop="country">
              <country-select v-model="innerProfile.country" />
              <div
                v-if="nonFieldErrors"
                class="el-form-item__error ModifiedFormError">{{ nonFieldErrors }}
              </div>
            </el-form-item>

            <el-form-item
              label="Site language"
              prop="language">
              <language-select v-model="innerProfile.language" />
            </el-form-item>
          </el-form>
        </el-col>

        <el-col
          :span="12"
          class="UserRole">
          <!-- SELECT ACCOUNT TYPE -->
          <div v-if="!innerProfile.account_type_approved || changeApprovedUserRole || !['G', 'CA', 'SCA', 'D', 'DA', 'SDA'].includes(innerProfile.account_type)">

            <h5 v-if="!userTypeRequested">I request to be a:</h5>

            <h5
              v-if="userTypeRequested"
              class="RoleRequested"><fa
                icon="sync-alt"
                spin />User role requested!</h5>

            <p v-if="userTypeRequested">Waiting for admin approval — you're still able to change your request by selecting an other role and saving your settings!</p>

            <el-checkbox
              v-model="isCountryUser"
              border><span class="IconRole IconGovernmentUser" />Government user</el-checkbox>

            <p class="UserArchTypeText">Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore aliqua.</p>

            <el-collapse-transition>
              <el-radio-group
                v-if="isCountryUser"
                v-model="innerProfile.account_type"
                :disabled="!isCountryUser"
                class="OnePerRow">
                <el-radio
                  label="G"
                  class="RadioSmall">Country user</el-radio>
                <ul
                  v-if="innerProfile.account_type === 'G'"
                  class="UserTypeTextList">
                  <li>List item 1</li>
                  <li>List item 2</li>
                  <li>List item 3</li>
                </ul>

                <el-radio
                  label="CA"
                  class="RadioSmall">Administrator of this country</el-radio>
                <ul
                  v-if="innerProfile.account_type === 'CA'"
                  class="UserTypeTextList">
                  <li>List item 1</li>
                  <li>List item 2</li>
                  <li>List item 3</li>
                </ul>

                <el-radio
                  label="SCA"
                  class="RadioSmall">Super country administrator</el-radio>
                <ul
                  v-if="innerProfile.account_type === 'SCA'"
                  class="UserTypeTextList">
                  <li>List item 1</li>
                  <li>List item 2</li>
                  <li>List item 3</li>
                </ul>
              </el-radio-group>
            </el-collapse-transition>

            <div class="Separator Or">
              <span>or</span>
            </div>

            <el-checkbox
              v-model="isDonorUser"
              border><span class="IconRole IconInvestorUser" />Financial investor</el-checkbox>

            <p class="UserArchTypeText">Sed eiusmod tempor incidunt ut labore et dolore aliqua. Morbi fringilla convallis sapien, id pulvinar odio volutpat.</p>

            <el-collapse-transition>
              <el-radio-group
                v-if="isDonorUser"
                v-model="innerProfile.account_type"
                :disabled="!isDonorUser"
                class="OnePerRow">
                <el-radio
                  :label="'D'"
                  class="RadioSmall">Donor</el-radio>
                <ul
                  v-if="innerProfile.account_type === 'D'"
                  class="UserTypeTextList">
                  <li>List item 1</li>
                  <li>List item 2</li>
                  <li>List item 3</li>
                </ul>

                <el-radio
                  :label="'DA'"
                  class="RadioSmall">Donor administrator</el-radio>
                <ul
                  v-if="innerProfile.account_type === 'DA'"
                  class="UserTypeTextList">
                  <li>List item 1</li>
                  <li>List item 2</li>
                  <li>List item 3</li>
                </ul>

                <el-radio
                  :label="'SDA'"
                  class="RadioSmall">Super donor administrator</el-radio>
                <ul
                  v-if="innerProfile.account_type === 'SDA'"
                  class="UserTypeTextList">
                  <li>List item 1</li>
                  <li>List item 2</li>
                  <li>List item 3</li>
                </ul>
              </el-radio-group>
            </el-collapse-transition>

            <el-collapse-transition>
              <el-form
                v-if="isDonorUser"
                label-position="top"
                class="DonorSelector"
                @submit.native.prevent>
                <el-form-item label="I want to be a part of this donor group:">
                  <el-select
                    v-model="innerProfile.donor"
                    size="small"
                    placeholder="Select from list">
                    <el-option
                      v-for="don in donors"
                      :key="don.value"
                      :label="don.label"
                      :value="don.value" />
                  </el-select>
                </el-form-item>
              </el-form>
            </el-collapse-transition>
          </div>

          <!-- APPROVED ACCOUNT TYPE -->
          <div v-if="innerProfile.account_type_approved && ['G', 'CA', 'SCA', 'D', 'DA', 'SDA'].includes(innerProfile.account_type) && !changeApprovedUserRole">

            <h5 class="RoleAccepted">
              <fa icon="check-circle" />
              Your user role request has been accepted!
            </h5>

            <div class="UserRoleDescription">
              <el-button
                size="mini"
                @click="changingUserRole">Change</el-button>

              <div
                v-if="innerProfile.account_type === 'G'"
                class="ClickThrough">
                <el-row
                  type="flex"
                  align="middle">
                  <el-col>
                    <span class="IconRole IconGovernmentUser" />
                  </el-col>
                  <el-col>
                    <h5>Government user</h5>
                    <span>Country user</span>
                  </el-col>
                </el-row>
                <div class="MyPrivileges">
                  <span>My Privileges are:</span>
                  <ul class="UserTypeTextList">
                    <li>List item 1</li>
                    <li>List item 2</li>
                    <li>List item 3</li>
                  </ul>
                </div>
              </div>

              <div
                v-if="innerProfile.account_type === 'CA'"
                class="ClickThrough">
                <el-row
                  type="flex"
                  align="middle">
                  <el-col>
                    <span class="IconRole IconGovernmentUser" />
                  </el-col>
                  <el-col>
                    <h5>Government user</h5>
                    <span>Country user admin</span>
                  </el-col>
                </el-row>
                <div class="MyPrivileges">
                  <span>My Privileges are:</span>
                  <ul class="UserTypeTextList">
                    <li>List item 1</li>
                    <li>List item 2</li>
                    <li>List item 3</li>
                  </ul>
                </div>
              </div>

              <div
                v-if="innerProfile.account_type === 'SCA'"
                class="ClickThrough">
                <el-row
                  type="flex"
                  align="middle">
                  <el-col>
                    <span class="IconRole IconGovernmentUser" />
                  </el-col>
                  <el-col>
                    <h5>Government user</h5>
                    <span>Super Country User Admin</span>
                  </el-col>
                </el-row>
                <div class="MyPrivileges">
                  <span>My Privileges are:</span>
                  <ul class="UserTypeTextList">
                    <li>List item 1</li>
                    <li>List item 2</li>
                    <li>List item 3</li>
                  </ul>
                </div>
              </div>

              <div
                v-if="innerProfile.account_type === 'D'"
                class="ClickThrough">
                <el-row
                  type="flex"
                  align="middle">
                  <el-col>
                    <span class="IconRole IconInvestorUser" />
                  </el-col>
                  <el-col>
                    <h5>Financial investor</h5>
                    <span>Donor</span>
                  </el-col>
                </el-row>
                <div class="MyPrivileges">
                  <span>My Privileges are:</span>
                  <ul class="UserTypeTextList">
                    <li>List item 1</li>
                    <li>List item 2</li>
                    <li>List item 3</li>
                  </ul>
                </div>
              </div>

              <div
                v-if="innerProfile.account_type === 'DA'"
                class="ClickThrough">
                <el-row
                  type="flex"
                  align="middle">
                  <el-col>
                    <span class="IconRole IconInvestorUser" />
                  </el-col>
                  <el-col>
                    <h5>Financial investor</h5>
                    <span>Donor admin</span>
                  </el-col>
                </el-row>
                <div class="MyPrivileges">
                  <span>My Privileges are:</span>
                  <ul class="UserTypeTextList">
                    <li>List item 1</li>
                    <li>List item 2</li>
                    <li>List item 3</li>
                  </ul>
                </div>
              </div>

              <div
                v-if="innerProfile.account_type === 'SDA'"
                class="ClickThrough">
                <el-row
                  type="flex"
                  align="middle">
                  <el-col>
                    <span class="IconRole IconInvestorUser" />
                  </el-col>
                  <el-col>
                    <h5>Financial investor</h5>
                    <span>Super donor admin</span>
                  </el-col>
                </el-row>
                <div class="MyPrivileges">
                  <span>My Privileges are:</span>
                  <ul class="UserTypeTextList">
                    <li>List item 1</li>
                    <li>List item 2</li>
                    <li>List item 3</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

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
              class="CancelButton"
              @click="dismissChanges">
              Dismiss changes
            </el-button>
          </el-col>
          <el-col
            :span="6"
            class="PrimaryAction">
            <el-button
              type="primary"
              size="medium"
              native-type="submit"
              @click="submit"
            >
              Save settings
            </el-button>
          </el-col>
        </el-row>
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
      donors: 'user/getDonorsForDropdown'
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
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .EditProfile {
    margin-bottom: 80px;

    .ProfileCard {
      width: @cardSizeMedium;
      margin: 0 auto;

      .UserForm {
        padding: 40px 80px;

        .CountrySelector {
          width: 100%;
        }
      }

      .UserRole {
        padding: 40px 80px;
        border-left: 1px solid @colorGrayLight;
        // background-color: #FFFBDC;

        h5 {
          margin: 0 0 10px;
          font-size: @fontSizeBase;
          font-weight: 700;
          line-height: 40px;

          &.RoleRequested {
            margin: 0;

            .svg-inline--fa {
              margin-right: 8px;
              color: @colorBrandAccent;
            }

            + p {
              margin: 0 0 30px;
              color: @colorTextMuted;
              font-size: @fontSizeSmall;
              line-height: 18px;
            }
          }

          &.RoleAccepted {
            font-weight: 400;

            .svg-inline--fa {
              margin-right: 8px;
              color: #67C23A;
            }
          }
        }

        .Separator {
          .SeparatorStyleHorizontal();
          margin: 30px 0;
        }

        .el-checkbox {
          &.is-bordered {
            position: relative;
            width: 100%;
            height: auto;
            padding: 15px;
            transition: @transitionAll;

            &:hover {
              .IconRole {
                filter: grayscale(0);
                opacity: 1;
              }
            }

            &:hover,
            &.is-checked {
              border-color: @colorBrandPrimary;
              background-color: @colorBrandBlueLight;

              .IconRole {
                filter: grayscale(0);
                opacity: 1;
              }
            }
          }
        }

        .el-radio-group {
          margin: 10px 0 0;
          padding: 0 30px;

          + .el-form {
            margin-top: 10px;
          }
        }

        .IconRole {
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translateY(-50%);
          display: inline-block;
          width: 36px;
          height: 24px;
          background-position: right center;
          background-size: contain;
          background-repeat: no-repeat;
          filter: grayscale(1);
          opacity: .6;
          transition: @transitionAll;

          &.IconGovernmentUser {
            top: 46%;
            background-image: url("~static/icon-role-government.svg");
          }

          &.IconInvestorUser {
            background-image: url("~static/icon-role-investor.svg");
          }
        }

        .UserArchTypeText {
          margin: 15px 0 0;
          font-size: @fontSizeSmall;
          line-height: 18px;
          color: @colorTextSecondary;
        }

        .UserTypeTextList {
          margin-bottom: 5px;

          li {
            font-size: @fontSizeSmall - 1;
            line-height: 18px;
            color: @colorTextSecondary;
          }
        }

        .DonorSelector {
          width: 100%;

          .el-form-item__label {
            font-size: @fontSizeSmall;
          }

          .el-select {
            min-width: 75%;
            max-width: 100%;
          }
        }

        .UserRoleDescription {
          position: relative;
          width: 100%;
          border: 1px solid @colorGray;

          .ClickThrough {
            pointer-events: none;
          }

          .el-row {
            .el-col {
              padding: 10px 10px 15px;

              &:nth-child(1) {
                width: auto;
              }

              &:nth-child(2) {
                width: 100%;
              }
            }
          }

          .el-button {
            position: absolute;
            top: 15px;
            right: 20px;
          }

          .IconRole {
            position: relative;
            top: 3px;
            right: auto;
            transform: none;
            filter: grayscale(0);
            opacity: 1;
            width: 32px;
            height: 48px;
            margin-left: 10px;
          }

          h5 {
            margin: 0;
            line-height: 24px;

            + span {
              font-size: @fontSizeBase - 1;
              color: @colorTextSecondary;
            }
          }

          .MyPrivileges {
            background-color: @colorGrayLightest;
            padding: 20px 20px 15px;

            > span {
              font-size: @fontSizeSmall;
            }

            ul {
              margin: 10px 30px;
              padding: 0;

              li {
                margin-bottom: 5px;
                font-size: @fontSizeSmall;
              }
            }
          }
        }
      }
    }
  }
</style>
