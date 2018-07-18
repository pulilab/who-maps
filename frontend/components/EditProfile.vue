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
          <el-input
            v-model="organisation"
            type="text" />
        </el-form-item>

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
              <el-input
                v-model="language"
                type="text" />
            </el-form-item>
          </el-col>
        </el-form-item>

      </el-form>
    </el-card>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
      user: 'user/getUser'
    }),

    lastModifiedDateStr () {
      return this.profile.modified.split('T')[0];
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

  methods: {
    dismissChanges () {
      this.innerProfile.name = '';
      this.innerProfile.organisation = '';
      this.innerProfile.country = '';
      this.innerProfile.language = '';
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
