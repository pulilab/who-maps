<template>
  <div class="EditProfile">

    <h1 class="Heading">Edit my profile</h1>

    <el-card
      :body-style="{ padding: '0px' }"
      class="ProfileCard">

      <el-form
        label-position="top"
        class="FormPart"
        @submit.native.prevent>
        <el-form-item label="My name">
          <el-input
            v-model="name"
            type="text" />
        </el-form-item>

        <el-form-item label="My email address">
          <el-input
            v-model="email"
            disabled
            type="text" />
        </el-form-item>

        <el-form-item label="Organisation name">
          <el-autocomplete
            v-model="organisation"
            :fetch-suggestions="orgSuggestions"
            class="full-width" />
        </el-form-item>

        <p v-if="newOrganisation">You're about to make a new organisation. Are you sure you can't find the one you were looking for?</p>
        <el-button
          v-if="newOrganisation"
          @click="addOrganisation(organisation)">Make new organisation: {{ organisation }}</el-button>

        <el-form-item label="Country">
          <el-select
            v-model="country"
            class="full-width">
            <el-option
              v-for="ctr in countries"
              :key="ctr.id"
              :label="ctr.name"
              :value="ctr.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="Site language">
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
      </el-form>

      <div class="Actions">
        <el-button @click="dismissChanges">Dismiss changes</el-button>
        <el-button @click="updateProfile">Save</el-button>
      </div>
    </el-card>

    <h3>TODO</h3>
    <ul>
      <li>E-mail binding</li>
      <li>Validations / requireds</li>
      <li>Strings mapping to the already translated ones</li>
    </ul>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data () {
    return {
      email: 'TODO: get it!',
      innerProfile: {
        name: '', // 'Takacs Andras Tamas'
        organisation: '', // code
        country: '', // code
        language: '' // string like 'en'
      }
    };
  },

  computed: {
    ...mapGetters({
      profile: 'user/getProfile',
      user: 'user/getUser',
      organisations: 'system/getOrganisations',
      languages: 'system/getLanguages',
      countries: 'landing/getCountries'
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
        if (this.innerProfile.organisation) {
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
        return this.innerProfile.country || this.profile.country;
      },
      set (value) {
        this.innerProfile.country = value;
      }
    },

    language: {
      get () {
        return this.innerProfile.language || this.profile.language;
      },
      set (value) {
        this.innerProfile.language = value;
      }
    }
  },

  async created () {
    await this.loadOrganisations();
  },

  methods: {
    ...mapActions({
      addOrganisation: 'system/addOrganisation',
      loadOrganisations: 'system/loadOrganisations',
      updateUserProfile: 'user/updateUserProfile'
    }),

    dismissChanges () {
      this.innerProfile.name = '';
      this.innerProfile.organisation = '';
      this.innerProfile.country = '';
      this.innerProfile.language = '';
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

    updateProfile () {
      const put = {};

      put.name = this.innerProfile.name || this.profile.name;
      put.country = this.innerProfile.country || this.profile.country;

      if (this.innerProfile.organisation) {
        put.organisation = this.organisations.find(org => {
          return org.name === this.innerProfile.organisation;
        }).id;
      } else {
        put.organisation = this.profile.organisation;
      }

      if (this.innerProfile.language) {
        put.language = this.innerProfile.language;
      }

      if (Object.keys(put).length) {
        console.log('Updating profile with:', put);
        this.updateUserProfile(put);
      }
    }

  }

};
</script>

<style lang="less">
@import "../assets/style/main.less";

.EditProfile {

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
}
</style>
