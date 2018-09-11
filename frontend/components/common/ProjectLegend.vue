<template>
  <div class="ProjectLegend">
    <template v-if="showStar">
      <fa
        icon="star"
        class="Owner" />
      <span v-show="showLabel"> <translate>Team Member</translate></span>
    </template>
    <template v-if="showEye">
      <fa
        icon="eye"
        class="Viewer" />
      <span v-show="showLabel"> <translate>Viewer</translate></span>
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
    forceStar: {
      type: Boolean,
      default: false
    },
    forceEye: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getProfile'
    }),
    isMember () {
      if (this.id) {
        return this.userProfile.member.includes(this.id);
      }
    },
    isViewer () {
      if (this.id) {
        return this.userProfile.viewer.includes(this.id);
      }
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

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .ProjectLegend {
    .Owner {
      color: @colorOwner;
    }

    .Viewer {
      color: @colorViewer;
    }
  }

</style>
