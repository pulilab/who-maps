<template>
  <div>
    <div :class="['Narrower', {'ForProfile': $route.path.split('/')[3] === 'edit-profile'} ]">
      <nuxt-child />
    </div>
  </div>
</template>

<script>
// NOTE: This is only a router view wrapper, for common fetches
import { mapGetters } from 'vuex';

export default {
  components: {
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
