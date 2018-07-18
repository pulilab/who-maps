<template>
  <div class="EditProfile">

    <h1 class="Heading">Edit User profile</h1>

    <el-card class="ProfileCard">
      <div
        slot="header"
        class="ProfileCardHeader">
        <div class="Title">General info</div>
        <div class="Update">Last update: {{ lastModifiedDateStr }}</div>
      </div>

      <el-form @submit.native.prevent>

        <el-form-item>
          <el-col :span="11">
            <el-form-item label="My name">
              <el-input
                v-model="name"
                type="text" />
            </el-form-item>
          </el-col>

          <el-col :span="2"><br></el-col>

          <el-col :span="11">
            <el-form-item label="My email address">
              <el-input
                v-model="innerProfile.email"
                disabled
                type="text" />
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="Organisation name">
          <el-autocomplete
            v-model="organisation"
            :fetch-suggestions="orgSuggestions"
            @select="handleSelect" />
        </el-form-item>

        <p v-if="newOrganisation">You're about to make a new organisation, are you sure you couldnt find the one you were looking for?</p>
        <el-button
          v-if="newOrganisation"
          @click="addOrganisation(organisation)">Make new organisation: {{ organisation }}</el-button>

        <el-form-item>
          <el-col :span="11">
            <el-form-item label="Country">
              <el-input
                v-model="country"
                type="text" />
            </el-form-item>
          </el-col>

          <el-col :span="2"><br></el-col>

          <el-col :span="11">
            <el-form-item label="Language">
              <el-select v-model="language">
                <el-option
                  v-for="lng in languages"
                  :key="lng.name"
                  :label="lng.name"
                  :value="lng.code" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>

      </el-form>
    </el-card>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data () {
    return {
      innerProfile: {
        name: '', // 'Takacs Andras Tamas'
        email: 'TODO: get it...',
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
      languages: 'system/getLanguages'
    }),

    lastModifiedDateStr () {
      return this.profile.modified.split('T')[0];
    },

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
        return this.innerProfile.organisation || this.profile.organisation;
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

  created () {
    this.loadOrganisations();
  },

  methods: {
    ...mapActions({
      addOrganisation: 'system/addOrganisation',
      loadOrganisations: 'system/loadOrganisations'
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

    handleSelect (item) {
      console.log('Selected', item);
    }

  }

};
</script>

<style lang="less">
@import "../assets/style/main.less";

.Heading {
  text-align: center;
  font-size: 32px;
  margin: 48px 0;
}

.ProfileCard {
  .limitWidthWithPadding;
  margin-bottom: 48px;

  .ProfileCardHeader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
