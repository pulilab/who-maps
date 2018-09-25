<template>
  <div>
    <dialogs-container />
    <top-bar />
    <action-bar v-if="showActionBar" />
    <nuxt/>
    <dha-footer />
    <django-feedback />
  </div>
</template>

<script>
import DhaFooter from '../components/common/DhaFooter.vue';
import TopBar from '../components/common/TopBar.vue';
import ActionBar from '../components/common/ActionBar.vue';
import DialogsContainer from '../components/dialogs/DialogsContainer.vue';
import DjangoFeedback from '../components/DjangoFeedback.vue';

export default {
  components: {
    DhaFooter,
    TopBar,
    ActionBar,
    DialogsContainer,
    DjangoFeedback
  },
  computed: {
    showActionBar () {
      const hiddenOn = ['index-login', 'index-signup'];
      if (this.$route && this.$route.name) {
        const pureRoute = this.$route.name.split('___')[0];
        return !hiddenOn.includes(pureRoute);
      }
    }
  }

};
</script>

<style>

</style>
