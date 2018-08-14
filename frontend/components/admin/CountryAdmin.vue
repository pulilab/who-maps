<template>
  <div class="CountryAdmin">

    <div class="AdminHeading">Country admin</div>

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
            :files.sync="coverImage"
            :limit="1"/>
        </el-form-item>

        <el-form-item label="Cover text">
          <h3>Cover text</h3>
        </el-form-item>

        <el-form-item label="Footer title">
          <h3>Footer title</h3>
        </el-form-item>

        <el-form-item label="Footer text">
          <h3>Footer text</h3>
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
      <el-button>Save changes</el-button>
    </el-row>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CollapsibleCard from '../project/CollapsibleCard';
import VueMapCustomizer from '../admin/VueMapCustomizer';
import DhaQuestionaire from '../admin/DhaQuestionaire';
import FileUpload from '../common/FileUpload';

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
      logo: [], // make setters and getters for it...
      coverImage: [], // make setters and getters for it...
      partnerLogos: [{
        name: 'baszod.jpg',
        url: 'https://digitalhealthatlas.org/static/partners/who-logo.png'
      }] // make setters and getters for it...
      // https://digitalhealthatlas.org/static/partners/who-logo.png
    };
  },

  computed: {
    ...mapGetters({
      country: 'admin/country/getCountry'
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
