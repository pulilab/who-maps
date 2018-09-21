<template>
  <div class="DjangoFeedback">
    <vue-django-feedback
      v-if="token"
      :name="name"
      :email="email"
      :csrf-token="token" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters({
      profile: 'user/getProfile',
      token: 'user/getToken'
    }),
    name () {
      if (this.profile) {
        return this.profile.name;
      }
    },
    email () {
      if (this.profile) {
        return this.profile.email;
      }
    }
  }
};
</script>

<style lang="less">
  @import "../node_modules/vue-django-feedback/dist/styles/variables";
  @import "../node_modules/vue-django-feedback/dist/styles/main";

  .DjangoFeedback {
    vue-django-feedback .vue-django-feedback {
          z-index: 5000;
    }
  }

</style>
