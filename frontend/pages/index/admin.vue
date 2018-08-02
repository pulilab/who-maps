<template>
  <div>
    <top-bar />
    <action-bar />
    <div :class="['Narrower', {'ForProfile': $route.path.split('/')[3] === 'edit-profile'} ]">
      <router-view />
    </div>
  </div>
</template>

<script>
// NOTE: This is only a router view wrapper, for common fetches
import { mapGetters } from 'vuex';
import TopBar from '../../components/common/TopBar.vue';
import ActionBar from '../../components/common/ActionBar.vue';

export default {
  components: {
    TopBar,
    ActionBar
  },
  middleware: ['isLoggedIn'],
  computed: {
    ...mapGetters({
    })
  },
  async fetch ({ store }) {}
};
</script>

<style lang="less">
.Narrower {
  width: 900px;
  margin: 0 auto;

  &.ForProfile {
    width: 560px;
  }
}
</style>
