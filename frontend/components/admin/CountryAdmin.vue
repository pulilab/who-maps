<template>
  <div class="CountryAdmin">
    <div class="PageTitle">
      <h2>Country admin</h2>
    </div>

    <collapsible-card
      title="Country information"
      class="CountryInformation">

      <el-form
        ref="countryInfo"
        :rules="rules"
        :model="{ logo, cover }"
        label-width="220px"
        label-position="left"
        @submit.native.prevent>

        <el-form-item
          label="Logo"
          prop="logo">
          <file-upload
            :disabled="notSCA"
            :auto-upload="false"
            :files.sync="logo"
            :limit="1"/>
        </el-form-item>

        <el-form-item
          label="Cover image"
          prop="cover">
          <file-upload
            :disabled="notSCA"
            :files.sync="cover"
            :limit="1"/>
        </el-form-item>

        <el-form-item label="Cover text">
          <el-input
            :disabled="notSCA"
            v-model="coverText"
            type="textarea"
            rows="5"/>
        </el-form-item>

        <el-form-item label="Footer title">
          <el-input
            :disabled="notSCA"
            v-model="footerTitle"
            type="text"/>
        </el-form-item>

        <el-form-item label="Footer text">
          <el-input
            :disabled="notSCA"
            v-model="footerText"
            type="text"/>
        </el-form-item>

        <el-form-item label="Project approval process">
          <el-checkbox
            :disabled="notSCA"
            v-model="projectApproval">
            {{ (projectApproval ? 'U' : 'Not u') + 'sed for projects in country' }}
          </el-checkbox>
        </el-form-item>

        <el-form-item
          label="Partner logos"
          prop="partnerLogos">
          <file-upload
            :disabled="notSCA"
            :files.sync="partnerLogos"
            :limit="10"/>
        </el-form-item>
      </el-form>

    </collapsible-card>

    <collapsible-card
      title="User management"
      class="UserManagement">
      <el-row type="flex">
        <el-col class="AdminPersonaChooser">
          <div
            :class="['Persona', { 'active': selectedPersona === 'G'}]"
            @click="selectPersona('G')">
            <div class="PersonaName">Users/viewers</div>
            <div class="RequestCount">{{ userSelection.length - users.length }} new request{{ (country.user_requests && country.user_requests.length) === 1 ? '' : 's' }}</div>
            <fa icon="chevron-right" />
          </div>
          <div
            :class="['Persona', { 'active': selectedPersona === 'CA'}]"
            @click="selectPersona('CA')">
            <div class="PersonaName">Admins</div>
            <div class="RequestCount">{{ adminSelection.length - admins.length }} new request{{ (country.admin_requests && country.admin_requests.length) === 1 ? '' : 's' }}</div>
            <fa icon="chevron-right" />
          </div>
          <div
            :class="['Persona', { 'active': selectedPersona === 'SCA'}]"
            @click="selectPersona('SCA')">
            <div class="PersonaName">Superadmins</div>
            <div class="RequestCount">{{ superadminSelection.length - superAdmins.length }} new request{{ (country.super_admin_requests && country.super_admin_requests.length) === 1 ? '' : 's' }}</div>
            <fa icon="chevron-right" />
          </div>
        </el-col>

        <el-col class="UserTransfers">
          <div
            v-if="selectedPersona === 'G'"
            class="PersonaPrivileges">
            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                  <fa icon="info-circle" /> Show privileges for {{ selectedPersona }}
                </template>
                <div>
                  <ul>
                    <li>List item 1</li>
                    <li>List item 2</li>
                    <li>List item 3</li>
                  </ul>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <el-transfer
            v-if="selectedPersona === 'G'"
            :titles="['New requests', 'Approved']"
            v-model="users"
            :data="userSelection"
            filterable
            filter-placeholder="Type to filter users..." />

          <div
            v-if="selectedPersona === 'CA'"
            class="PersonaPrivileges">
            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                  <fa icon="info-circle" /> Show privileges for {{ selectedPersona }}
                </template>
                <div>
                  <ul>
                    <li>List item 1</li>
                    <li>List item 2</li>
                    <li>List item 3</li>
                  </ul>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <el-transfer
            v-if="selectedPersona === 'CA'"
            :titles="['New requests', 'Approved']"
            v-model="admins"
            :data="adminSelection"
            filterable
            filter-placeholder="Type to filter users..." />

          <div
            v-if="selectedPersona === 'SCA'"
            class="PersonaPrivileges">
            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                  <fa icon="info-circle" /> Show privileges for {{ selectedPersona }}
                </template>
                <div>
                  <ul>
                    <li>List item 1</li>
                    <li>List item 2</li>
                    <li>List item 3</li>
                  </ul>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <el-transfer
            v-if="selectedPersona === 'SCA'"
            :titles="['New requests', 'Approved']"
            v-model="superAdmins"
            :data="superadminSelection"
            filterable
            filter-placeholder="Type to filter users..." />
        </el-col>
      </el-row>
    </collapsible-card>

    <collapsible-card title="Country specific questionaire">
      <h1>Country specific questionaire</h1>
      <dha-questionaire :label="'Country specific questionaire'"/>
    </collapsible-card>

    <collapsible-card title="Country map">
      <div v-if="!country.map_files.length || forceMapFileChange">
        <el-form
          label-width="215px"
          label-position="left"
          @submit.native.prevent>
          <el-form-item label="Country file">
            <el-upload
              :show-file-list="false"
              :limit="1"
              :multiple="false"
              :data="{country: country.id}"
              :on-success="successHandler"
              :before-upload="beforeMapUpload"
              name="map_file"
              action="/api/map-files/">
              <el-button
                :disalbed="uploadMapFile"
                :loading="uploadMapFile"
                icon="el-icon-plus"
                type="text">Upload file</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="country.map_files.length && !forceMapFileChange">
        <vue-map-customizer/>
      </div>
      <a
        ref="hiddenMapDownload"
        :href="`/api/countries/map-download/${country.id}/`"
        style="display: none"
        download>Hidden but needed element!</a>
      <el-button @click="$refs.hiddenMapDownload.click()">
        Download map file
      </el-button>
      <el-button @click="showMapUploader">
        <span v-show="forceMapFileChange">Cancel</span>
        <span v-show="!forceMapFileChange">Change map file</span>
      </el-button>
    </collapsible-card>

    <div class="AdminActionBarBottom">
      <el-row
        type="flex"
        justify="space-between">
        <el-button>Dismiss changes</el-button>
        <el-button @click="saveChanges">Save changes</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CollapsibleCard from '../project/CollapsibleCard';
import VueMapCustomizer from '../admin/VueMapCustomizer';
import DhaQuestionaire from '../admin/DhaQuestionaire';
import FileUpload from '../common/FileUpload';
import { mapGettersActions } from '../../utilities/form';

export default {

  name: 'CountryAdministrator',

  components: {
    CollapsibleCard,
    VueMapCustomizer,
    DhaQuestionaire,
    FileUpload
  },

  data () {
    return {
      selectedPersona: 'G',
      logoError: '',
      coverError: '',
      flagForKeepingPartnerLogosError: false,
      partnerLogosError: '',
      rules: {
        logo: [
          { validator: (rule, value, callback) => {
            if (this.logoError) {
              callback(new Error(this.logoError));
            } else {
              callback();
            }
          }}
        ],
        cover: [
          { validator: (rule, value, callback) => {
            if (this.coverError) {
              callback(new Error(this.coverError));
            } else {
              callback();
            }
          }}
        ],
        partnerLogos: [
          { validator: (rule, value, callback) => {
            if (this.partnerLogosError) {
              callback(new Error(this.partnerLogosError));
            } else {
              callback();
            }
          }}
        ]
      },
      forceMapFileChange: false,
      mapFile: {},
      uploadMapFile: false
    };
  },

  computed: {
    ...mapGettersActions({
      coverText: ['admin/country', 'getCoverText', 'setCoverText'],
      footerTitle: ['admin/country', 'getFooterTitle', 'setFooterTitle'],
      footerText: ['admin/country', 'getFooterText', 'setFooterText'],
      projectApproval: ['admin/country', 'getProjectApproval', 'setProjectApproval']
    }),

    ...mapGetters({
      country: 'admin/country/getData',
      userSelection: 'admin/country/getUserSelection',
      adminSelection: 'admin/country/getAdminSelection',
      superadminSelection: 'admin/country/getSuperadminSelection',
      userProfile: 'user/getProfile'
    }),

    notSCA () {
      return this.userProfile.account_type === 'CA' && !this.userProfile.is_superuser;
    },

    logo: {
      get () {
        if (typeof this.country.logo === 'string') {
          return [{
            url: this.country.logo,
            name: ('' + this.country.logo).split('/').pop()
          }];
        } else if (!this.country.logo) {
          return [];
        } else {
          return [this.country.logo];
        }
      },
      set ([value]) {
        this.setDataField({field: 'logo', data: value});
      }
    },

    cover: {
      get () {
        if (typeof this.country.cover === 'string') {
          return [{
            url: this.country.cover,
            name: ('' + this.country.cover).split('/').pop()
          }];
        } else if (!this.country.cover) {
          return [];
        } else {
          return [this.country.cover];
        }
      },
      set ([value]) {
        this.setDataField({field: 'cover', data: value});
      }
    },

    partnerLogos: {
      get () {
        return this.country.partner_logos.map(rawLogo => {
          if (rawLogo.raw || rawLogo.uid) {
            return rawLogo;
          } else if (rawLogo.image) {
            return ({
              url: rawLogo.image,
              name: ('' + rawLogo.image).split('/').pop(),
              id: rawLogo.id
            });
          }
        });
      },
      set (value) {
        this.setDataField({field: 'partner_logos', data: value});
      }
    },

    users: {
      get () {
        return this.country.users || [];
      },
      set (value) {
        this.setDataField({field: 'users', data: value});
      }
    },

    admins: {
      get () {
        return this.country.admins || [];
      },
      set (value) {
        this.setDataField({field: 'admins', data: value});
      }
    },

    superAdmins: {
      get () {
        return this.country.super_admins || [];
      },
      set (value) {
        this.setDataField({field: 'super_admins', data: value});
      }
    }
  },

  watch: {
    logo (newArr, oldArr) {
      // Handles error message placing for wrong image formats
      if (!newArr.length) {
        return;
      }

      const filteredArray = [...this.logo.filter(image => {
        return !image.raw || (image.raw && image.raw.name.endsWith('.jpg')) || (image.raw && image.raw.name.endsWith('.jpeg')) || (image.raw && image.raw.name.endsWith('.png'));
      })];

      if (newArr.length !== filteredArray.length) {
        this.logo = filteredArray;
        this.logoError = 'Wrong image format, you can only upload .jpg and .png files';
      } else {
        this.logoError = '';
      }
      this.$refs.countryInfo.validate(() => {});
    },

    cover (newArr, oldArr) {
      // Handles error message placing for wrong image formats
      if (!newArr.length) {
        return;
      }

      const filteredArray = [...this.cover.filter(image => {
        return !image.raw || (image.raw && image.raw.name.endsWith('.jpg')) || (image.raw && image.raw.name.endsWith('.jpeg')) || (image.raw && image.raw.name.endsWith('.png'));
      })];

      if (newArr.length !== filteredArray.length) {
        this.cover = filteredArray;
        this.coverError = 'Wrong image format, you can only upload .jpg and .png files';
      } else {
        this.coverError = '';
      }
      this.$refs.countryInfo.validate(() => {});
    },

    partnerLogos (newArr, oldArr) {
      // Handles error message placing for wrong image formats
      const filteredArray = [...this.partnerLogos.filter(image => {
        return !image.raw || (image.raw && image.raw.name.endsWith('.jpg')) || (image.raw && image.raw.name.endsWith('.jpeg')) || (image.raw && image.raw.name.endsWith('.png'));
      })];

      if (newArr.length !== filteredArray.length) {
        this.partnerLogos = filteredArray;
        this.partnerLogosError = 'Wrong image format, you can only upload .jpg and .png files';
        this.flagForKeepingPartnerLogosError = true;
      } else if (this.flagForKeepingPartnerLogosError) {
        this.flagForKeepingPartnerLogosError = false;
        return;
      } else {
        this.partnerLogosError = '';
      }
      this.$refs.countryInfo.validate(() => {});
    }
  },

  methods: {
    ...mapActions({
      setDataField: 'admin/country/setDataField',
      saveChanges: 'admin/country/saveChanges',
      loadGeoJSON: 'admin/map/loadGeoJSON'
    }),

    selectPersona (selected) {
      this.selectedPersona = selected;
    },
    showMapUploader () {
      this.forceMapFileChange = !this.forceMapFileChange;
    },
    beforeMapUpload () {
      this.uploadMapFile = true;
    },
    successHandler (response) {
      this.setDataField({field: 'map_files', data: [response]});
      setTimeout(async () => {
        await this.loadGeoJSON();
        this.forceMapFileChange = false;
        this.uploadMapFile = false;
      });
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .CountryAdmin {
    margin-bottom: 60px;

    .CollapsibleCard {
      width: @cardSizeMedium;
      margin: 0 auto 20px;
    }

    .CountryInformation {
      .ContentContainer {
        padding: 40px;
      }

      .el-checkbox {
        line-height: 40px;
      }
    }

    .UserManagement {
      .ContentContainer {
        padding: 0;
      }

      .AdminPersonaChooser {
        width: 200px;
        border-right: 2px solid @colorGrayLighter;

        .Persona {
          position: relative;
          display: block;
          padding: 16px 20px;
          border-bottom: 1px solid @colorGrayLighter;
          cursor: pointer;
          transition: @transitionAll;

          .PersonaName {
            color: @colorTextSecondary;
            font-size: @fontSizeBase;
            line-height: 16px;
            margin-bottom: 8px;
          }

          .RequestCount {
            color: @colorTextMuted;
            font-size: @fontSizeSmall;
          }

          .svg-inline--fa {
            position: absolute;
            top: 50%;
            right: 12px;
            transform: translateY(-50%);
            height: 14px;
            opacity: 0;
            transition: @transitionAll;
          }

          &:hover {
            background-color: @colorGrayLightest;

            .PersonaName {
              color: @colorTextPrimary;
            }

            .RequestCount {
              color: @colorGray;
            }

            .svg-inline--fa {
              opacity: .5;
            }
          }

          &.active {
            background-color: mix(@colorWhite, @colorBrandPrimary, 90%);
            border-color: mix(@colorWhite, @colorBrandPrimary, 70%);

            .PersonaName {
              font-weight: 700;
              color: @colorBrandPrimary;
            }

            .RequestCount {
              color: @colorTextSecondary;
            }

            .svg-inline--fa {
              color: @colorBrandPrimary;
              opacity: 1;
            }
          }
        }
      }

      .UserTransfers {
        padding: 20px 40px;

        .PersonaPrivileges {
          margin: 0 0 20px;

          ul {
            margin: 0;
            padding: 0 0 0 40px;

            li {
              font-size: @fontSizeSmall;
              line-height: 18px;
              color: @colorTextSecondary;
            }
          }
        }

        .el-transfer {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          margin: 0 0 20px;
        }

        .el-transfer-panel {
          width: 100%;
          // max-height: 50vh;
        }

        // .el-transfer-buttons {}
      }
    }
  }
</style>
