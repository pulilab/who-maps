<template>
  <div class="ProjectLegend">
    <i
      v-show="showStar"
      class="el-icon-star-on" />
    <i
      v-show="showEye"
      class="el-icon-view" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    forceStar: {
      type: Boolean,
      default: false
    },
    forceEye: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getProfile'
    }),
    isMember () {
      return this.userProfile.member.includes(this.id);
    },
    isViewer () {
      return this.userProfile.viewer.includes(this.id);
    },
    showStar () {
      return this.forceStar || this.isMember;
    },
    showEye () {
      return this.forceStar || (!this.isMember && this.isViewer);
    }
  }
};
</script>

<style>

</style>
