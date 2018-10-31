<template>
  <div class="ProjectLegendContent">
    <template v-if="showStar">
      <fa
        icon="star"
        size="xs"
        class="Owner" />
      <span v-show="showLabel"> <translate>Team Member</translate></span>
    </template>
    <template v-if="showEye">
      <fa
        icon="eye"
        size="xs"
        class="Viewer" />
      <span v-show="showLabel"> <translate>Viewer</translate></span>
    </template>
    <template v-if="showHandshake">
      <fa
        icon="handshake"
        size="xs"
        class="Viewer" />
      <span v-show="showLabel"> <translate>Donor</translate></span>
    </template>
    <template v-if="showGlobe">
      <fa
        icon="globe-africa"
        size="xs"
        class="Viewer" />
      <span v-show="showLabel"> <translate>Country admin</translate></span>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    id: {
      type: Number,
      default: null
    },
    donors: {
      type: Array,
      default: () => []
    },
    country: {
      type: Number,
      default: null
    },
    forceStar: {
      type: Boolean,
      default: false
    },
    forceEye: {
      type: Boolean,
      default: false
    },
    forceHandshake: {
      type: Boolean,
      default: false
    },
    forceGlobe: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: false
    },
    compactMode: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getProfile'
    }),
    isMember () {
      if (this.id && this.userProfile) {
        return this.userProfile.member.includes(this.id);
      }
    },
    isViewer () {
      if (this.id && this.userProfile) {
        return this.userProfile.viewer.includes(this.id);
      }
    },
    isTeam () {
      return this.isMember || this.isViewer;
    },
    isDonor () {
      const donorPersonas = ['D', 'DA', 'SDA'];
      if (this.donors && Array.isArray(this.donors) && this.userProfile) {
        return donorPersonas.includes(this.userProfile.account_type) && this.donors.includes(this.userProfile.donor);
      }
    },
    isCountry () {
      const countryPersonas = ['G', 'CA', 'SCA'];
      if (this.country && this.userProfile) {
        return countryPersonas.includes(this.userProfile.account_type) && this.country === this.userProfile.country;
      }
    },
    showStar () {
      return this.forceStar || this.isMember;
    },
    showEye () {
      return this.forceEye || (!this.isMember && this.isViewer);
    },
    showHandshake () {
      return this.forceHandshake || (this.isDonor && !this.isTeam);
    },
    showGlobe () {
      return this.forceGlobe || (this.isCountry && !this.isTeam);
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .ProjectLegendContent {

    .Owner {
      color: @colorOwner;
    }

    .Viewer {
      color: @colorViewer;
    }
  }

</style>
