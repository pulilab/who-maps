<template>
  <div class="CountryAdmin">
    <div class="PageTitle">
      <h2>Donor admin for {{ donor.name }}</h2>
    </div>

    <collapsible-card
      title="Donor information"
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
            :disabled="notSDA"
            :auto-upload="false"
            :files.sync="logo"
            :limit="1"/>
        </el-form-item>

        <el-form-item
          label="Cover image"
          prop="cover">
          <file-upload
            :disabled="notSDA"
            :files.sync="cover"
            :limit="1"/>
        </el-form-item>

        <el-form-item label="Cover text">
          <el-input
            :disabled="notSDA"
            v-model="coverText"
            type="textarea"
            rows="5"/>
        </el-form-item>

        <el-form-item label="Footer title">
          <el-input
            :disabled="notSDA"
            v-model="footerTitle"
            type="text"/>
        </el-form-item>

        <el-form-item label="Footer text">
          <el-input
            :disabled="notSDA"
            v-model="footerText"
            type="text"/>
        </el-form-item>

        <el-form-item
          label="Partner logos"
          prop="partnerLogos">
          <file-upload
            :disabled="notSDA"
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
            :class="['Persona', { 'active': selectedPersona === 'D'}]"
            @click="selectPersona('D')">
            <div class="PersonaName">Users/viewers</div>
            <div class="RequestCount">{{ userSelection.length - users.length }} new request{{ (donor.user_requests && donor.user_requests.length) === 1 ? '' : 's' }}</div>
          </div>
          <div
            :class="['Persona', { 'active': selectedPersona === 'DA'}]"
            @click="selectPersona('DA')">
            <div class="PersonaName">Admins</div>
            <div class="RequestCount">{{ adminSelection.length - admins.length }} new request{{ (donor.admin_requests && donor.admin_requests.length) === 1 ? '' : 's' }}</div>
          </div>
          <div
            :class="['Persona', { 'active': selectedPersona === 'SDA'}]"
            @click="selectPersona('SDA')">
            <div class="PersonaName">Superadmins</div>
            <div class="RequestCount">{{ superadminSelection.length - superAdmins.length }} new request{{ (donor.super_admin_requests && donor.super_admin_requests.length) === 1 ? '' : 's' }}</div>
          </div>
        </el-col>

        <el-col class="UserTransfers">

          <div
            v-if="selectedPersona === 'D'"
            class="Privileges">
            Privileges for {{ selectedPersona }}
          </div>
          <el-transfer
            v-if="selectedPersona === 'D'"
            :titles="['New requests', 'Approved']"
            v-model="users"
            :data="userSelection"
            filterable
            filter-placeholder="Type to filter users..." />

          <div
            v-if="selectedPersona === 'DA'"
            class="Privileges">
            Privileges for {{ selectedPersona }}
            Asdf
          </div>
          <el-transfer
            v-if="selectedPersona === 'DA'"
            :titles="['New requests', 'Approved']"
            v-model="admins"
            :data="adminSelection"
            filterable
            filter-placeholder="Type to filter users..." />

          <div
            v-if="selectedPersona === 'SDA'"
            class="Privileges">
            Privileges for {{ selectedPersona }}
            Lorem ipsum this and that
          </div>
          <el-transfer
            v-if="selectedPersona === 'SDA'"
            :titles="['New requests', 'Approved']"
            v-model="superAdmins"
            :data="superadminSelection"
            filterable
            filter-placeholder="Type to filter users..." />

        </el-col>
      </el-row>
    </collapsible-card>

    <!-- <collapsible-card title="Country specific questionaire">
      <h1>Country specific questionaire</h1>
      <dha-questionaire :label="'Country specific questionaire'"/>
    </collapsible-card> -->

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
      selectedPersona: 'D',
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
      }
    };
  },

  computed: {
    ...mapGettersActions({
      coverText: ['admin/donor', 'getCoverText', 'setCoverText'],
      footerTitle: ['admin/donor', 'getFooterTitle', 'setFooterTitle'],
      footerText: ['admin/donor', 'getFooterText', 'setFooterText']
    }),

    ...mapGetters({
      donor: 'admin/donor/getData',
      userSelection: 'admin/donor/getUserSelection',
      adminSelection: 'admin/donor/getAdminSelection',
      superadminSelection: 'admin/donor/getSuperadminSelection',
      userProfile: 'user/getProfile'
    }),

    notSDA () {
      return this.userProfile.account_type === 'DA' && !this.userProfile.is_superuser;
    },

    logo: {
      get () {
        if (typeof this.donor.logo === 'string') {
          return [{
            url: this.donor.logo,
            name: ('' + this.donor.logo).split('/').pop()
          }];
        } else if (!this.donor.logo) {
          return [];
        } else {
          return [this.donor.logo];
        }
      },
      set ([value]) {
        this.setDataField({field: 'logo', data: value});
      }
    },

    cover: {
      get () {
        if (typeof this.donor.cover === 'string') {
          return [{
            url: this.donor.cover,
            name: ('' + this.donor.cover).split('/').pop()
          }];
        } else if (!this.donor.cover) {
          return [];
        } else {
          return [this.donor.cover];
        }
      },
      set ([value]) {
        this.setDataField({field: 'cover', data: value});
      }
    },

    partnerLogos: {
      get () {
        return this.donor.partner_logos.map(rawLogo => {
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
        return this.donor.users || [];
      },
      set (value) {
        this.setDataField({field: 'users', data: value});
      }
    },

    admins: {
      get () {
        return this.donor.admins || [];
      },
      set (value) {
        this.setDataField({field: 'admins', data: value});
      }
    },

    superAdmins: {
      get () {
        return this.donor.super_admins || [];
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
      setDataField: 'admin/donor/setDataField',
      saveChanges: 'admin/donor/saveChanges',
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
    }

    .UserManagement {
      .ContentContainer {
        padding: 0;
      }

      .AdminPersonaChooser {
        width: 161px;
        height: 600px;
        box-shadow: 2px 0 8px 0 rgba(0,0,0,0.16);

        .Persona {
          padding: 14px 20px;
          width: 160px;
          height: 66px;
          box-sizing: border-box;
          cursor: pointer;

          .PersonaName {
            color: @colorTextPrimary;
            font-family: Arial;
            font-size: @fontSizeBase;
            line-height: 16px;
            margin-bottom: 8px;
          }
          .RequestCount {
            color: @colorTextMuted;
            font-family: Arial;
            font-size: @fontSizeSmall;
            line-height: 14px;
          }

          &.active {
            background-color: @colorBrandBlueLight;
            box-shadow: 0 1px 0 0 rgba(0,141,201,0.25);

            .PersonaName {
              color: @colorBrandPrimary;
              font-weight: bold;
            }
            .RequestCount {
              color: @colorTextSecondary;
            }
          }
        }
      }

      .UserTransfers {
        .el-transfer {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }
        .el-transfer-panel {
          width: 300px;
        }
      }
    }
  }
</style>
