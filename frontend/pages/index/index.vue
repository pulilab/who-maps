<template>
  <div>
    <input
      v-model="username"
      placeholder="username"
      type="text">
    <input
      v-model="password"
      placeholder="password"
      type="password">
    <button @click="loginLocal">Log in</button>
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

    loginLocal () {
      if (this.username && this.password) {
        this.login({username: this.username, password: this.password});
      }
    }
  }
};
</script>

<style>

</style>
