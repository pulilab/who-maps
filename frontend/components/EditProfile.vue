<template>
  <div class="EditProfile">
    <div class="PageTitle">
      <h2><translate>Edit my profile</translate></h2>
    </div>

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

        <el-row type="flex">
          <el-col
            :span="12"
            class="UserForm">

            <el-form-item
              :label="$gettext('My name')"
              prop="name">
              <el-input
                v-model="innerProfile.name"
                type="text" />
            </el-form-item>

            <el-form-item
              :label="$gettext('My email address')"
              class="is-required">
              <el-input
                v-model="innerProfile.email"
                disabled
                type="text" />
            </el-form-item>

            <el-form-item
              :label="$gettext('Organisation name')"
              prop="organisation">
              <organisation-select v-model="innerProfile.organisation" />
            </el-form-item>

            <el-form-item
              :label="$gettext('Country')"
              prop="country">
              <country-select v-model="innerProfile.country" />
              <div
                v-if="nonFieldErrors"
                class="el-form-item__error ModifiedFormError">{{ nonFieldErrors }}
              </div>
            </el-form-item>

            <el-form-item
              :label="$gettext('Site language')"
              prop="language">
              <language-select v-model="innerProfile.language" />
            </el-form-item>

          </el-col>

          <el-col
            :span="12"
            class="UserRole">
            <!-- SELECT ACCOUNT TYPE -->
            <div v-if="!innerProfile.account_type_approved || changeApprovedUserRole || !['G', 'CA', 'SCA', 'D', 'DA', 'SDA'].includes(innerProfile.account_type)">

              <h5 v-if="!userTypeRequested"><translate>I request to be a:</translate></h5>

              <h5
                v-if="userTypeRequested"
                class="RoleRequested"><fa
                  icon="circle-notch"
                  spin /><translate>User role requested!</translate></h5>

              <p v-if="userTypeRequested"><translate>Waiting for admin approval — you're still able to change your request by selecting an other role and saving your settings!</translate></p>

              <div
                v-if="userTypeRequested"
                class="Separator" />

              <el-checkbox
                v-model="isCountryUser"
                border><span class="IconRole IconGovernmentUser" /><translate>Government user</translate></el-checkbox>

              <p class="UserArchTypeText"><translate>Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore aliqua.</translate></p>

              <el-collapse-transition>
                <el-radio-group
                  v-if="isCountryUser"
                  v-model="innerProfile.account_type"
                  :disabled="!isCountryUser"
                  class="OnePerRow">
                  <el-radio
                    label="G"
                    class="RadioSmall"><translate>Country user</translate></el-radio>
                  <ul
                    v-if="innerProfile.account_type === 'G'"
                    class="UserTypeTextList">
                    <li><translate>List item 1</translate></li>
                    <li><translate>List item 2</translate></li>
                    <li><translate>List item 3</translate></li>
                  </ul>

                  <el-radio
                    label="CA"
                    class="RadioSmall">Administrator of this country</el-radio>
                  <ul
                    v-if="innerProfile.account_type === 'CA'"
                    class="UserTypeTextList">
                    <li><translate>List item 1</translate></li>
                    <li><translate>List item 2</translate></li>
                    <li><translate>List item 3</translate></li>
                  </ul>

                  <el-radio
                    label="SCA"
                    class="RadioSmall">Super country administrator</el-radio>
                  <ul
                    v-if="innerProfile.account_type === 'SCA'"
                    class="UserTypeTextList">
                    <li><translate>List item 1</translate></li>
                    <li><translate>List item 2</translate></li>
                    <li><translate>List item 3</translate></li>
                  </ul>
                </el-radio-group>
              </el-collapse-transition>

              <div class="Separator Or">
                <span><translate>or</translate></span>
              </div>

              <el-checkbox
                v-model="isDonorUser"
                border><span class="IconRole IconInvestorUser" /><translate>Financial investor</translate></el-checkbox>

              <p class="UserArchTypeText"><translate>Sed eiusmod tempor incidunt ut labore et dolore aliqua. Morbi fringilla convallis sapien, id pulvinar odio volutpat.</translate></p>

              <el-collapse-transition>
                <el-radio-group
                  v-if="isDonorUser"
                  v-model="innerProfile.account_type"
                  :disabled="!isDonorUser"
                  class="OnePerRow">
                  <el-radio
                    :label="'D'"
                    class="RadioSmall"><translate>Donor</translate></el-radio>
                  <ul
                    v-if="innerProfile.account_type === 'D'"
                    class="UserTypeTextList">
                    <li><translate>List item 1</translate></li>
                    <li><translate>List item 2</translate></li>
                    <li><translate>List item 3</translate></li>
                  </ul>

                  <el-radio
                    :label="'DA'"
                    class="RadioSmall"><translate>Donor administrator</translate></el-radio>
                  <ul
                    v-if="innerProfile.account_type === 'DA'"
                    class="UserTypeTextList">
                    <li><translate>List item 1</translate></li>
                    <li><translate>List item 2</translate></li>
                    <li><translate>List item 3</translate></li>
                  </ul>

                  <el-radio
                    :label="'SDA'"
                    class="RadioSmall"><translate>Super donor administrator</translate></el-radio>
                  <ul
                    v-if="innerProfile.account_type === 'SDA'"
                    class="UserTypeTextList">
                    <li><translate>List item 1</translate></li>
                    <li><translate>List item 2</translate></li>
                    <li><translate>List item 3</translate></li>
                  </ul>
                </el-radio-group>
              </el-collapse-transition>

              <el-collapse-transition>
                <div
                  v-if="isDonorUser"
                  class="DonorSelector">
                  <el-form-item
                    :label="$gettext('I want to be a part of this donor group:')"
                    prop="donor"
                  >
                    <donor-select
                      v-model="innerProfile.donor"
                    />
                  </el-form-item>
                </div>
              </el-collapse-transition>
            </div>

            <!-- APPROVED ACCOUNT TYPE -->
            <div v-if="innerProfile.account_type_approved && ['G', 'CA', 'SCA', 'D', 'DA', 'SDA'].includes(innerProfile.account_type) && !changeApprovedUserRole">

              <h5 class="RoleAccepted">
                <fa icon="check-circle" />
                <translate>Your user role request has been accepted!</translate>
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
                      <h5><translate>Government user</translate></h5>
                      <span><translate>Country user</translate></span>
                    </el-col>
                  </el-row>
                  <div class="MyPrivileges">
                    <span><translate>My Privileges are:</translate></span>
                    <ul class="UserTypeTextList">
                      <li><translate>List item 1</translate></li>
                      <li><translate>List item 2</translate></li>
                      <li><translate>List item 3</translate></li>
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
                      <h5><translate>Government user</translate></h5>
                      <span><translate>Country user admin</translate></span>
                    </el-col>
                  </el-row>
                  <div class="MyPrivileges">
                    <span><translate>My Privileges are:</translate></span>
                    <ul class="UserTypeTextList">
                      <li><translate>List item 1</translate></li>
                      <li><translate>List item 2</translate></li>
                      <li><translate>List item 3</translate></li>
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
                      <h5><translate>Government user</translate></h5>
                      <span><translate>Super Country User Admin</translate></span>
                    </el-col>
                  </el-row>
                  <div class="MyPrivileges">
                    <span><translate>My Privileges are:</translate></span>
                    <ul class="UserTypeTextList">
                      <li><translate>List item 1</translate></li>
                      <li><translate>List item 2</translate></li>
                      <li><translate>List item 3</translate></li>
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
                      <h5><translate>Financial investor</translate></h5>
                      <span><translate>Donor</translate></span>
                    </el-col>
                  </el-row>
                  <div class="MyPrivileges">
                    <span><translate>My Privileges are:</translate></span>
                    <ul class="UserTypeTextList">
                      <li><translate>List item 1</translate></li>
                      <li><translate>List item 2</translate></li>
                      <li><translate>List item 3</translate></li>
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
                      <h5><translate>Financial investor</translate></h5>
                      <span><translate>Donor admin</translate></span>
                    </el-col>
                  </el-row>
                  <div class="MyPrivileges">
                    <span><translate>My Privileges are:</translate></span>
                    <ul class="UserTypeTextList">
                      <li><translate>List item 1</translate></li>
                      <li><translate>List item 2</translate></li>
                      <li><translate>List item 3</translate></li>
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
                      <h5><translate>Financial investor</translate></h5>
                      <span><translate>Super donor admin</translate></span>
                    </el-col>
                  </el-row>
                  <div class="MyPrivileges">
                    <span><translate>My Privileges are:</translate></span>
                    <ul class="UserTypeTextList">
                      <li><translate>List item 1</translate></li>
                      <li><translate>List item 2</translate></li>
                      <li><translate>List item 3</translate></li>
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
                class="CancelButton IconLeft"
                @click="dismissChanges">
                <fa icon="reply" />
                <translate>Dismiss changes</translate>
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
                <translate>Save settings</translate>
              </el-button>
            </el-col>
          </el-row>

        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import FormAPIErrorsMixin from './mixins/FormAPIErrorsMixin';
import OrganisationSelect from './common/OrganisationSelect';
import LanguageSelect from './common/LanguageSelect';
import CountrySelect from './common/CountrySelect';
import DonorSelect from './common/DonorSelect';

export default {
  components: {
    OrganisationSelect,
    LanguageSelect,
    CountrySelect,
    DonorSelect
  },
  mixins: [FormAPIErrorsMixin],
  data () {
    return {
      innerProfile: {
        name: null,
        organisation: null,
        language: null,
        country: null,
        account_type: null,
        donor: null
      },
      isCountryUser: false,
      isDonorUser: false,
      changeApprovedUserRole: false
    };
  },

  computed: {
    ...mapGetters({
      profile: 'user/getProfile',
      user: 'user/getUser',
      donors: 'system/getDonors'
    }),

    userTypeRequested () {
      return this.profile && this.profile.account_type !== 'I' && !this.profile.account_type_approved;
    },
    isDonorRequired () {
      return this.innerProfile && this.innerProfile.account_type && ['D', 'DA', 'SDA'].includes(this.innerProfile.account_type);
    },
    rules () {
      return {
        name: [
          { required: true, message: this.$gettext('This field is required'), trigger: 'change' },
          { validator: this.validatorGenerator('name') }
        ],
        organisation: [
          { required: true, message: this.$gettext('This field is required'), trigger: 'change' },
          { validator: this.validatorGenerator('organisation') }
        ],
        language: [
          { required: true, message: this.$gettext('This field is required'), trigger: 'change' },
          { validator: this.validatorGenerator('language') }
        ],
        country: [
          { required: true, message: this.$gettext('This field is required'), trigger: 'change' },
          { validator: this.validatorGenerator('country') }
        ],
        donor: [
          {required: this.isDonorRequired, message: this.$gettext('This field is required'), trigger: 'change'},
          { validator: this.validatorGenerator('donor') }
        ]
      };
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
      this.$router.go(-1);
    },

    submit () {
      this.deleteFormAPIErrors();
      this.changeApprovedUserRole = false;
      this.$refs.editProfileForm.validate(async valid => {
        if (valid) {
          try {
            const isFirstSave = !this.profile.country;
            await this.updateUserProfile(this.innerProfile);
            window.scrollTo(0, 0);
            this.$message({
              message: this.$gettext('Profile succesfully updated'),
              type: 'success',
              showClose: true
            });
            if (isFirstSave) {
              this.routeToDashboard(this.innerProfile.language);
            } else {
              this.changeLocale(this.innerProfile.language);
            }
          } catch (err) {
            console.log('ERR:', err);
            this.setFormAPIErrors(err);
            this.$refs.editProfileForm.validate(() => {});
            this.$message({
              message: this.$gettext('Profile update error'),
              type: 'error',
              showClose: true
            });
          }
        }
      });
    },
    changeLocale (locale) {
      if (locale !== this.$i18n.locale) {
        const name = this.$route.name.split('___')[0];
        const path = this.localePath({...this.$route, name}, locale);
        this.$router.replace(path);
      }
    },
    routeToDashboard (locale) {
      const path = this.localePath({name: 'organisation-dashboard', params: this.$route.params}, locale);
      this.$router.push(path);
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
              margin-right: 6px;
              color: darken(@colorDraft, 15%);
            }

            + p {
              margin: 0;
              color: @colorTextSecondary;
              font-size: @fontSizeSmall;
              line-height: 18px;
            }
          }

          &.RoleAccepted {
            font-weight: 400;

            .svg-inline--fa {
              margin-right: 6px;
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
