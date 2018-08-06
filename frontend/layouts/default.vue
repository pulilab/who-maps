<template>
  <div>
    <dialogs-container />
    <top-bar />
    <action-bar v-if="showActionBar" />
    <nuxt/>
    <dha-footer />
  </div>
</template>

<script>
import DhaFooter from '../components/common/DhaFooter.vue';
import TopBar from '../components/common/TopBar.vue';
import ActionBar from '../components/common/ActionBar.vue';
import DialogsContainer from '../components/dialogs/DialogsContainer.vue';

export default {
  components: {
    DhaFooter,
    TopBar,
    ActionBar,
    DialogsContainer
  },
  computed: {
    showActionBar () {
      const hiddenOn = ['index-login', 'index-signup'];
      const pureRoute = this.$route.name.split('___')[0];
      return !hiddenOn.includes(pureRoute);
    }
  }

};
</script>

<style>

</style>
