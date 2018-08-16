<template>
  <div class="CountryAdmin">

    <div class="AdminHeading">Country admin</div>

    <!-- <p>country.logo {{ country.logo }}</p>
    <p>logo {{ logo }}</p> -->

    <collapsible-card title="Country information">

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

    <collapsible-card title="User management">
      <h1>User management</h1>
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

  computed: {
    ...mapGettersActions({
      coverText: ['admin/country', 'getCoverText', 'setCoverText'],
      footerTitle: ['admin/country', 'getFooterTitle', 'setFooterTitle'],
      footerText: ['admin/country', 'getFooterText', 'setFooterText']
    }),

    ...mapGetters({
      country: 'admin/country/getCountry'
    }),

    logo: {
      get () {
        if (typeof this.country.logo === 'string') {
          return [{
            url: this.country.logo,
            name: this.country.logo.split('/').pop()
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
            name: this.country.cover.split('/').pop()
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
        return this.country.partner_logos || [];
      },
      set (value) {
        this.setCountryField({field: 'partner_logos', data: value});
      }
    }
  },

  methods: {
    ...mapActions({
      setCountryField: 'admin/country/setCountryField',
      saveChanges: 'admin/country/saveChanges'
    })
  }
};
</script>

<style lang="less">
  .CountryAdmin {
    .AdminHeading {
      color: #474747;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: -1px;
      line-height: 24px;
      text-align: center;
      margin: 40px 0;
    }

    padding-bottom: 80px;
  }
</style>
