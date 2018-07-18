<template>
  <div>

    <el-input
      v-model="username"
      placeholder="username"
      type="text" />

    <el-input
      v-model="password"
      placeholder="password"
      type="password" />

    <el-button @click="loginLocal">Log in</el-button>

  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data () {
    return {
      username: '',
      password: ''
    };
  },

  methods: {
    ...mapActions({
      login: 'user/doLogin'
    }),

    async loginLocal () {
      if (this.username && this.password) {
        try {
          await this.login({username: this.username, password: this.password});
          this.$router.push(this.localePath('/'));
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
};
</script>

<style>

</style>
