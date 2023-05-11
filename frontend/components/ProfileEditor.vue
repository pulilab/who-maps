<template>
  <div class="EditProfile">
    <el-card
      :body-style="{ padding: '0px' }"
      class="ProfileCard"
    >
      <el-form
        ref="editProfileForm"
        :rules="rules"
        :model="innerProfile"
        label-position="top"
        class="FormPart"
        @submit.native.prevent
      >
        <el-row type="flex">
          <el-col
            :span="12"
            class="UserForm"
          >
            <el-form-item
              :label="$gettext('First and Last Name') | translate"
              prop="name"
            >
              <el-input
                v-model="innerProfile.name"
                type="text"
                data-vv-name="name"
              />
            </el-form-item>

            <el-form-item
              :label="$gettext('Email address') | translate"
              class="is-required"
            >
              <el-row>
                <el-col :span="17">
                  <el-input
                    v-model="innerProfile.email"
                    disabled
                    type="text"
                  />
                </el-col>
                <el-col :span="7">
                  <el-button
                    class="ChangeEmail"
                    type="primary"
                    @click="openFeedback"
                  >
                    <translate>
                      Change
                    </translate>
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item
              :label="$gettext('Organisation name') | translate"
              prop="organisation"
              data-vv-name="organisation"
            >
              <organisation-select v-model="innerProfile.organisation" />
            </el-form-item>

            <el-form-item
              :label="$gettext('Country') | translate"
              prop="country"
              data-vv-name="country"
            >
              <country-select v-model="innerProfile.country" />
              <div
                v-if="nonFieldErrors"
                class="el-form-item__error ModifiedFormError"
              >
                {{ nonFieldErrors }}
              </div>
            </el-form-item>

            <el-form-item
              :label="$gettext('Designation / Title') | translate"
              prop="title"
            >
              <el-input
                v-model="innerProfile.title"
                type="text"
                data-vv-name="title"
              />
            </el-form-item>

            <el-form-item
              :label="$gettext('LinkedIn profile') | translate"
              prop="linkedin"
            >
              <el-input
                v-model="innerProfile.linkedin"
                type="text"
                data-vv-name="linkedin"
              />
            </el-form-item>

            <el-form-item
              :label="$gettext('Site language') | translate"
              prop="language"
            >
              <language-select v-model="innerProfile.language" />
            </el-form-item>

            <el-form-item>
              <label class="el-form-item__label">
                <translate>Email notifications (standard)</translate>
              </label>
            </el-form-item>
            <el-form-item>
              <div class="Switch-container">
                <filter-switch
                  v-model="innerProfile.daily_toolkit_digest_notification"
                  :label="
                    $gettext('Weekly Project Toolkit updates (Y/N)') | translate
                  "
                  :tooltip="
                    $gettext(
                      'If a project you are part of completes the MAPS Assessment for a project, any changes in the assessment data will be noted in this email. You can update this selection any time by returning to your My Profile page.'
                    ) | translate
                  "
                />
              </div>
            </el-form-item>
          </el-col>

          <el-col
            :span="12"
            class="UserRole"
          >
            <!-- SELECT ACCOUNT TYPE -->
            <div
              v-if="
                !innerProfile.account_type_approved ||
                  changeApprovedUserRole ||
                  !['G', 'CA', 'SCA', 'D', 'DA', 'SDA'].includes(
                    innerProfile.account_type
                  )
              "
            >
              <h5 v-if="!userTypeRequested">
                <translate>I request to be a:</translate>
              </h5>

              <h5
                v-if="userTypeRequested"
                class="RoleRequested"
              >
                <fa
                  icon="circle-notch"
                  spin
                /><translate>
                  Your user access has been submitted
                </translate>
              </h5>

              <p v-if="userTypeRequested">
                <translate>
                  We will notify you via email when your user access has been
                  approved. If you would like to request a different type of
                  access, you can resubmit the form below and saving your
                  changes.
                </translate>
              </p>

              <div
                v-if="userTypeRequested"
                class="Separator"
              />

              <el-checkbox
                v-model="isNoneUser"
                border
              >
                <span class="IconRole IconNoneUser">
                  <fa icon="user-friends" />
                </span>
                <translate>No additional access required</translate>
              </el-checkbox>

              <p class="UserArchTypeText">
                <translate>
                  The DHA has additional features to support Ministries of
                  Health and Investors to understand and organize their digital
                  health implementations. If you plan to use the DHA to register
                  projects only, select this option for your profile. Your
                  access level can be updated at any time by returning to your
                  profile page.
                </translate>
              </p>
              <p class="UserHowToText">
                <span @click="openHowToDialog(1)">
                  <translate>Learn more</translate>
                  <fa icon="arrow-right" />
                </span>
              </p>

              <div class="Separator Or">
                <span><translate>or</translate></span>
              </div>

              <section class="space-bottom">
                <el-checkbox
                  v-model="isCountryUser"
                  border
                >
                  <span class="IconRole IconGovernmentUser" /><translate>
                    Government user
                  </translate>
                </el-checkbox>

                <p class="UserArchTypeText">
                  <translate>
                    Privileges for Government Users are detailed below. Select
                    the user type that most matches your role within the DHA.
                    This request will be received by the Government Admin team
                    and a response will be sent via email for your
                    request.
                  </translate>
                </p>
                <p class="UserHowToText">
                  <span @click="openHowToDialog(2)">
                    <translate>Learn more</translate>
                    <fa icon="arrow-right" />
                  </span>
                </p>

                <el-collapse-transition>
                  <el-radio-group
                    v-if="isCountryUser"
                    v-model="innerProfile.account_type"
                    :disabled="!isCountryUser"
                    class="OnePerRow"
                  >
                    <el-radio
                      label="G"
                      class="RadioSmall"
                    >
                      <translate>Government Viewers</translate>
                    </el-radio>
                    <user-privileges
                      v-if="innerProfile.account_type === 'G'"
                      type="G"
                    />
                    <el-radio
                      label="CA"
                      class="RadioSmall"
                    >
                      Government Admins for this country
                    </el-radio>
                    <user-privileges
                      v-if="innerProfile.account_type === 'CA'"
                      type="CA"
                    />

                    <el-radio
                      label="SCA"
                      class="RadioSmall"
                    >
                      Government System Admins
                    </el-radio>
                    <user-privileges
                      v-if="innerProfile.account_type === 'SCA'"
                      type="SCA"
                    />
                  </el-radio-group>
                </el-collapse-transition>
              </section>
              <el-checkbox
                v-model="isDonorUser"
                border
              >
                <span class="IconRole IconInvestorUser" /><translate>
                  Investor
                </translate>
              </el-checkbox>

              <p class="UserArchTypeText">
                <translate>
                  If you are part of an investor group that is providing either
                  financial or in-kind support to project activities, the DHA
                  can be used to help organize and connect all of your projects.
                  By joining your investor page, you will see information that
                  is private to your organization. If your group is not listed
                  below, send an email to digital-health-atlas@who.int to add
                  them to the list.
                </translate>
              </p>
              <p class="UserHowToText">
                <span @click="openHowToDialog(3)">
                  <translate>Learn more</translate>
                  <fa icon="arrow-right" />
                </span>
              </p>

              <el-collapse-transition>
                <div
                  v-if="isDonorUser"
                  class="DonorSelectorWrapper"
                >
                  <el-form-item
                    :label="
                      $gettext('I request to join the investor group below:')
                        | translate
                    "
                    prop="donor"
                  >
                    <donor-select v-model="innerProfile.donor" />
                  </el-form-item>
                </div>
              </el-collapse-transition>

              <el-collapse-transition>
                <el-radio-group
                  v-if="isDonorUser"
                  v-model="innerProfile.account_type"
                  :disabled="!isDonorUser"
                  class="OnePerRow"
                >
                  <el-radio
                    :label="'D'"
                    class="RadioSmall"
                  >
                    <translate>Investor Viewers</translate>
                  </el-radio>
                  <user-privileges
                    v-if="innerProfile.account_type === 'D'"
                    type="D"
                  />

                  <el-radio
                    :label="'DA'"
                    class="RadioSmall"
                  >
                    <translate>Investor Admins</translate>
                  </el-radio>
                  <user-privileges
                    v-if="innerProfile.account_type === 'DA'"
                    type="DA"
                  />

                  <el-radio
                    :label="'SDA'"
                    class="RadioSmall"
                  >
                    <translate>Investor System Admins</translate>
                  </el-radio>
                  <user-privileges
                    v-if="innerProfile.account_type === 'SDA'"
                    type="SDA"
                  />
                </el-radio-group>
              </el-collapse-transition>
            </div>

            <!-- APPROVED ACCOUNT TYPE -->
            <div
              v-if="
                innerProfile.account_type_approved &&
                  ['G', 'CA', 'SCA', 'D', 'DA', 'SDA'].includes(
                    innerProfile.account_type
                  ) &&
                  !changeApprovedUserRole
              "
            >
              <h5 class="RoleAccepted">
                <fa icon="check-circle" />
                <translate>Your user role request has been accepted!</translate>
              </h5>

              <div class="UserRoleDescription">
                <el-button
                  size="mini"
                  @click="changingUserRole"
                >
                  Change
                </el-button>

                <div
                  v-if="innerProfile.account_type === 'G'"
                  class="ClickThrough"
                >
                  <el-row
                    type="flex"
                    align="middle"
                  >
                    <el-col>
                      <span class="IconRole IconGovernmentUser" />
                    </el-col>
                    <el-col>
                      <h5><translate>Government User</translate></h5>
                      <span><translate>Government Viewer</translate></span>
                    </el-col>
                  </el-row>
                  <div class="MyPrivileges">
                    <notify-switch
                      :project_updates_notification.sync="
                        innerProfile.project_updates_notification
                      "
                      :project_approval_request_notification.sync="
                        innerProfile.project_approval_request_notification
                      "
                      :role_request_notification.sync="
                        innerProfile.role_request_notification
                      "
                    />
                    <span><translate>My Government Viewer access includes:</translate></span>
                    <user-privileges
                      v-if="innerProfile.account_type === 'G'"
                      type="G"
                    />
                  </div>
                </div>

                <div
                  v-if="innerProfile.account_type === 'CA'"
                  class="ClickThrough"
                >
                  <el-row
                    type="flex"
                    align="middle"
                  >
                    <el-col>
                      <span class="IconRole IconGovernmentUser" />
                    </el-col>
                    <el-col>
                      <h5><translate>Government User</translate></h5>
                      <span><translate>Government Admin</translate></span>
                    </el-col>
                  </el-row>
                  <div class="MyPrivileges">
                    <notify-switch
                      :project_updates_notification.sync="
                        innerProfile.project_updates_notification
                      "
                      :project_approval_request_notification.sync="
                        innerProfile.project_approval_request_notification
                      "
                      :role_request_notification.sync="
                        innerProfile.role_request_notification
                      "
                    />
                    <span><translate>My Government Admin access includes:</translate></span>
                    <user-privileges
                      v-if="innerProfile.account_type === 'CA'"
                      type="CA"
                    />
                  </div>
                </div>

                <div
                  v-if="innerProfile.account_type === 'SCA'"
                  class="ClickThrough"
                >
                  <el-row
                    type="flex"
                    align="middle"
                  >
                    <el-col>
                      <span class="IconRole IconGovernmentUser" />
                    </el-col>
                    <el-col>
                      <h5><translate>Government User</translate></h5>
                      <span><translate>Government System Admin</translate></span>
                    </el-col>
                  </el-row>
                  <div class="MyPrivileges">
                    <notify-switch
                      :project_updates_notification.sync="
                        innerProfile.project_updates_notification
                      "
                      :project_approval_request_notification.sync="
                        innerProfile.project_approval_request_notification
                      "
                      :role_request_notification.sync="
                        innerProfile.role_request_notification
                      "
                    />
                    <span><translate>My Government System Admin access includes:</translate></span>
                    <user-privileges
                      v-if="innerProfile.account_type === 'SCA'"
                      type="SCA"
                    />
                  </div>
                </div>

                <div
                  v-if="innerProfile.account_type === 'D'"
                  class="ClickThrough"
                >
                  <el-row
                    type="flex"
                    align="middle"
                  >
                    <el-col>
                      <span class="IconRole IconInvestorUser" />
                    </el-col>
                    <el-col>
                      <h5><translate>Financial Investor</translate></h5>
                      <span><translate>Investor Viewer</translate></span>
                    </el-col>
                  </el-row>
                  <div class="MyPrivileges">
                    <notify-switch
                      :project_updates_notification.sync="
                        innerProfile.project_updates_notification
                      "
                      :project_approval_request_notification.sync="
                        innerProfile.project_approval_request_notification
                      "
                      :role_request_notification.sync="
                        innerProfile.role_request_notification
                      "
                    />
                    <span><translate>My Investor Viewer access includes:</translate></span>
                    <user-privileges
                      v-if="innerProfile.account_type === 'D'"
                      type="D"
                    />
                  </div>
                </div>

                <div
                  v-if="innerProfile.account_type === 'DA'"
                  class="ClickThrough"
                >
                  <el-row
                    type="flex"
                    align="middle"
                  >
                    <el-col>
                      <span class="IconRole IconInvestorUser" />
                    </el-col>
                    <el-col>
                      <h5><translate>Financial Investor</translate></h5>
                      <span><translate>Investor Admin</translate></span>
                    </el-col>
                  </el-row>
                  <div class="MyPrivileges">
                    <notify-switch
                      :project_updates_notification.sync="
                        innerProfile.project_updates_notification
                      "
                      :project_approval_request_notification.sync="
                        innerProfile.project_approval_request_notification
                      "
                      :role_request_notification.sync="
                        innerProfile.role_request_notification
                      "
                    />
                    <span><translate>My Investor Admin access includes:</translate></span>
                    <user-privileges
                      v-if="innerProfile.account_type === 'DA'"
                      type="DA"
                    />
                  </div>
                </div>

                <div
                  v-if="innerProfile.account_type === 'SDA'"
                  class="ClickThrough"
                >
                  <el-row
                    type="flex"
                    align="middle"
                  >
                    <el-col>
                      <span class="IconRole IconInvestorUser" />
                    </el-col>
                    <el-col>
                      <h5><translate>Financial Investor</translate></h5>
                      <span><translate>Investor System Admin</translate></span>
                    </el-col>
                  </el-row>
                  <div class="MyPrivileges">
                    <notify-switch
                      :project_updates_notification.sync="
                        innerProfile.project_updates_notification
                      "
                      :project_approval_request_notification.sync="
                        innerProfile.project_approval_request_notification
                      "
                      :role_request_notification.sync="
                        innerProfile.role_request_notification
                      "
                    />
                    <span><translate>My Investor System Admin access includes:</translate></span>
                    <user-privileges
                      v-if="innerProfile.account_type === 'SDA'"
                      type="SDA"
                    />
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
            class="cardActions"
          >
            <el-col
              :span="6"
              class="SecondaryAction"
            >
              <el-button
                type="text"
                class="CancelButton IconLeft"
                @click="dismissChanges"
              >
                <fa icon="reply" />
                <translate>Dismiss changes</translate>
              </el-button>
            </el-col>
            <el-col
              :span="6"
              class="PrimaryAction"
            >
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
import { mapGetters, mapActions } from 'vuex'
import FormAPIErrorsMixin from './mixins/FormAPIErrorsMixin'
import OrganisationSelect from './common/OrganisationSelect'
import LanguageSelect from './common/LanguageSelect'
import CountrySelect from './common/CountrySelect'
import DonorSelect from './common/DonorSelect'
import UserPrivileges from './UserPrivileges'
import FilterSwitch from '~/components/dashboard/FilterSwitch'
import NotifySwitch from '~/components/common/NotifySwitchers'

export default {
  components: {
    OrganisationSelect,
    LanguageSelect,
    CountrySelect,
    DonorSelect,
    UserPrivileges,
    FilterSwitch,
    NotifySwitch
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
        donor: null,
        daily_toolkit_digest_notification: true,
        project_updates_notification: true,
        project_approval_request_notification: true,
        role_request_notification: true,
        title: null,
        linkedin: null
      },
      isCountryUser: false,
      isDonorUser: false,
      isNoneUser: true,
      changeApprovedUserRole: false
    }
  },

  computed: {
    ...mapGetters({
      profile: 'user/getProfile',
      donors: 'system/getDonors'
    }),

    userTypeRequested () {
      return (
        this.profile &&
        this.profile.account_type !== 'I' &&
        !this.profile.account_type_approved
      )
    },
    isDonorRequired () {
      return (
        this.innerProfile &&
        this.innerProfile.account_type &&
        ['D', 'DA', 'SDA'].includes(this.innerProfile.account_type)
      )
    },
    rules () {
      return {
        name: [
          {
            required: true,
            message: this.$gettext('This field is required'),
            trigger: 'change'
          },
          { validator: this.validatorGenerator('name') }
        ],
        organisation: [
          {
            required: true,
            message: this.$gettext('This field is required'),
            trigger: 'change'
          },
          { validator: this.validatorGenerator('organisation') }
        ],
        language: [
          {
            required: true,
            message: this.$gettext('This field is required'),
            trigger: 'change'
          },
          { validator: this.validatorGenerator('language') }
        ],
        country: [
          {
            required: true,
            message: this.$gettext('This field is required'),
            trigger: 'change'
          },
          { validator: this.validatorGenerator('country') }
        ],
        donor: [
          {
            required: this.isDonorRequired,
            message: this.$gettext('This field is required'),
            trigger: 'change'
          },
          { validator: this.validatorGenerator('donor') }
        ],
        linkedin: [
          {
            type: 'url',
            message: this.$gettext('Has to be a valid url'),
            trigger: 'blur'
          },
          { validator: this.validatorGenerator('linkedin') }
        ]
      }
    }
  },

  watch: {
    isCountryUser: function (newVal, oldVal) {
      if (newVal && !oldVal) {
        this.isDonorUser = false
        this.isNoneUser = false
        if (!['G', 'CA', 'SCA'].includes(this.innerProfile.account_type)) {
          this.innerProfile.account_type = 'G'
        }
      } else if (!newVal && !this.isDonorUser) {
        this.innerProfile.account_type = 'I'
      }
    },
    isDonorUser: function (newVal, oldVal) {
      if (newVal && !oldVal) {
        this.isCountryUser = false
        this.isNoneUser = false
        if (!['D', 'DA', 'SDA'].includes(this.innerProfile.account_type)) {
          this.innerProfile.account_type = 'D'
        }
      } else if (!newVal && !this.isCountryUser) {
        this.innerProfile.account_type = 'I'
      }
    },
    isNoneUser: function (newVal, oldVal) {
      if (newVal && !oldVal) {
        this.isCountryUser = false
        this.isDonorUser = false
        this.innerProfile.account_type = 'I'
      }
    },
    profile: {
      immediate: true,
      handler (profile) {
        this.innerProfile = { ...profile }
      }
    }
  },

  mounted () {
    this.isCountryUser = ['G', 'CA', 'SCA'].includes(this.profile.account_type)
    this.isDonorUser = ['D', 'DA', 'SDA'].includes(this.profile.account_type)
  },

  methods: {
    ...mapActions({
      updateUserProfile: 'user/updateUserProfile',
      openHowToDialog: 'layout/openHowToDialog'
    }),

    openFeedback () {
      this.$store.commit('user/SET_FEEDBACK', {
        feedbackOn: true,
        feedbackForm: {
          subject: this.$gettext('Change email request'),
          message: this.$gettext('Change my email to:')
        }
      })
    },

    dismissChanges () {
      this.innerProfile = { ...this.profile }
      this.$router.go(-1)
    },

    submit () {
      this.deleteFormAPIErrors()
      this.changeApprovedUserRole = false
      this.$refs.editProfileForm.validate(async valid => {
        if (valid) {
          try {
            const isFirstSave = !this.profile.country
            await this.updateUserProfile(this.innerProfile)
            await this.$auth.fetchUser()
            window.scrollTo(0, 0)
            this.$message({
              message: this.$gettext('Profile succesfully updated'),
              type: 'success',
              showClose: true
            })
            if (isFirstSave) {
              this.routeToDashboard(this.innerProfile.language)
            } else {
              this.changeLocale(this.innerProfile.language)
            }
          } catch (err) {
            console.log('ERR:', err)
            this.setFormAPIErrors(err)
            this.$refs.editProfileForm.validate(() => {})
            this.$message({
              message: this.$gettext('Profile update error'),
              type: 'error',
              showClose: true
            })
          }
        }
      })
    },
    changeLocale (locale) {
      if (locale !== this.$i18n.locale) {
        const name = this.$route.name.split('___')[0]
        const path = this.localePath({ ...this.$route, name }, locale)
        this.$router.replace(path)
      }
    },
    routeToDashboard (locale) {
      const path = this.localePath(
        { name: 'organisation-dashboard', params: this.$route.params },
        locale
      )
      this.$router.push(path)
    },
    changingUserRole () {
      this.changeApprovedUserRole = true
    }
  }
}
</script>

<style lang="less">
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

.EditProfile {
  .ChangeEmail {
    overflow: hidden;
    width: 100%;
  }

  .space-bottom {
    margin-bottom: 32px;
  }

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
            color: #67c23a;
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
        opacity: 0.6;
        transition: @transitionAll;

        &.IconGovernmentUser {
          top: 46%;
          background-image: url("~static/icon-role-government.svg");
        }

        &.IconNoneUser {
          font-size: 20px;
          right: 5px;
          .svg-inline--fa {
            color: @colorBrandPrimary;
          }
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

      .UserHowToText {
        text-align: right;
        margin-top: 6px;
        font-size: @fontSizeSmall;
        line-height: 18px;
        color: @colorBrandPrimary;
        span {
          cursor: pointer;
        }
        svg {
          margin-left: 7px;
        }
      }

.UserTypeTextList {
        margin-bottom: 10px;

        li {
          margin-bottom: 5px;
          font-size: @fontSizeSmall - 1;
          line-height: 16px;
          color: @colorTextSecondary;
        }
      }

      .DonorSelectorWrapper {
        width: 100%;
        margin-top: 20px;

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

          & > .el-row {
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
        }

        & > .el-button {
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
            font-size: @fontSizeBase;
            font-weight: bold;
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
  .el-form-item__label {
    padding: 0 0 3px 0;
    line-height: 30px;
  }
  .el-form .el-form-item {
    margin-bottom: 10px;
  }
  .Switch-container {
    margin-top: 0;
  }
}
</style>
