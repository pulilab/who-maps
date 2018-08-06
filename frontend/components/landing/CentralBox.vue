<template>
  <div class="CentralBox">
    <signup-box v-if="!isLoggedIn" />
    <my-projects-box v-if="isLoggedIn" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import SignupBox from './SignupBox';
import MyProjectsBox from './MyProjectsBox';

export default {
  components: {
    SignupBox,
    MyProjectsBox
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getProfile'
    }),
    isLoggedIn () {
      return !!this.userProfile;
    }
  }
};
</script>

<style>

</style>
