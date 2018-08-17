<template>
  <div class="CountryAdmin">

    <div class="AdminHeading">Country admin</div>

    <collapsible-card
      title="Country information"
      class="CountryInformation">

      <el-form
        label-width="215px"
        label-position="left">

        <el-form-item label="Logo">
          <file-upload
            :files.sync="logo"
            :limit="1"/>
        </el-form-item>

        <el-form-item label="Cover image">
          <file-upload
            :files.sync="cover"
            :limit="1"/>
        </el-form-item>

        <el-form-item label="Cover text">
          <el-input
            v-model="coverText"
            type="textarea"
            rows="5"/>
        </el-form-item>

        <el-form-item label="Footer title">
          <el-input
            v-model="footerTitle"
            type="text"/>
        </el-form-item>

        <el-form-item label="Footer text">
          <el-input
            v-model="footerText"
            type="text"/>
        </el-form-item>

        <el-form-item label="Partner logo">
          <file-upload
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
            class="Persona"
            @click="selectPersona('G')">
            <div class="PersonaName">Users/viewers</div>
            <div class="RequestCount">{{ userSelection.length - users.length }} new request{{ country.user_requests.length === 1 ? '' : 's' }}</div>
          </div>
          <div
            class="Persona"
            @click="selectPersona('CA')">
            <div class="PersonaName">Admins</div>
            <div class="RequestCount">{{ adminSelection.length - admins.length }} new request{{ country.admin_requests.length === 1 ? '' : 's' }}</div>
          </div>
          <div
            class="Persona"
            @click="selectPersona('SCA')">
            <div class="PersonaName">Superadmins</div>
            <div class="RequestCount">{{ superadminSelection.length - superAdmins.length }} new request{{ country.super_admin_requests.length === 1 ? '' : 's' }}</div>
          </div>
        </el-col>
        <el-col>
          Privileges for {{ selectedPersona }}

          <el-transfer
            v-if="selectedPersona === 'G'"
            :titles="['New requests', 'Approved']"
            v-model="users"
            :data="userSelection" />

          <el-transfer
            v-if="selectedPersona === 'CA'"
            :titles="['New requests', 'Approved']"
            v-model="admins"
            :data="adminSelection" />

          <el-transfer
            v-if="selectedPersona === 'SCA'"
            :titles="['New requests', 'Approved']"
            v-model="superAdmins"
            :data="superadminSelection" />

        </el-col>
      </el-row>
    </collapsible-card>

    <collapsible-card title="Country specific questionaire">
      <h1>Country specific questionaire</h1>
      <dha-questionaire :label="'Country specific questionaire'"/>
    </collapsible-card>

    <collapsible-card title="Country map">
      <vue-map-customizer/>
    </collapsible-card>

    <hr>

    <el-row
      type="flex"
      justify="space-between">
      <el-button>Dismiss changes</el-button>
      <el-button @click="saveChanges">Save changes</el-button>
    </el-row>

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
      selectedPersona: 'SCA'
    };
  },

  computed: {
    ...mapGettersActions({
      coverText: ['admin/country', 'getCoverText', 'setCoverText'],
      footerTitle: ['admin/country', 'getFooterTitle', 'setFooterTitle'],
      footerText: ['admin/country', 'getFooterText', 'setFooterText']
    }),

    ...mapGetters({
      country: 'admin/country/getCountry',
      userSelection: 'admin/country/getUserSelection',
      adminSelection: 'admin/country/getAdminSelection',
      superadminSelection: 'admin/country/getSuperadminSelection',
      getUsers: 'admin/country/getUsers',
      getAdmins: 'admin/country/getAdmins',
      getSuperadmins: 'admin/country/getSuperadmins'
    }),

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
        this.setCountryField({field: 'logo', data: value});
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
        this.setCountryField({field: 'cover', data: value});
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
              name: ('' + rawLogo.image).split('/').pop()
            });
          }
        });
      },
      set (value) {
        this.setCountryField({field: 'partner_logos', data: value});
      }
    },

    users: {
      get () {
        return this.country.users;
      },
      set (value) {
        this.setCountryField({field: 'users', data: value});
      }
    },

    admins: {
      get () {
        return this.country.admins;
      },
      set (value) {
        this.setCountryField({field: 'admins', data: value});
      }
    },

    superAdmins: {
      get () {
        return this.country.super_admins;
      },
      set (value) {
        this.setCountryField({field: 'super_admins', data: value});
      }
    }

  },

  methods: {
    ...mapActions({
      setCountryField: 'admin/country/setCountryField',
      saveChanges: 'admin/country/saveChanges'
    }),

    selectPersona (selected) {
      this.selectedPersona = selected;
    }
  }
};
</script>

<style lang="less">
  .CountryAdmin {
    padding-bottom: 80px;

    .AdminHeading {
      color: #474747;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: -1px;
      line-height: 24px;
      text-align: center;
      margin: 40px 0;
    }

    .CountryInformation {
      .ContentContainer {
        padding: 30px;
      }
    }

    .UserManagement {
      .ContentContainer {
        padding: 0 0;
      }
      .AdminPersonaChooser {
        width: 161px;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.5), 2px 0 8px 0 rgba(0,0,0,0.16);

        .Persona {
          width: 160px;
          height: 66px;
          // .PersonaName {}
          // .RequestCount {}

          &.active {
            background-color: lightblue;
            // .PersonaName {}
            // .RequestCount {}
          }

        }
      }
    }

  }
</style>
