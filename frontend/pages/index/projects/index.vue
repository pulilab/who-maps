<template>
  <div class="MyProjects">
    <div class="PageTitle">
      <h2>My Projects</h2>
      <p>
        List of all the projects you are a
        <fa
          icon="star"
          class="Owner" />
        <b>Member</b> or
        <fa
          icon="eye"
          class="Viewer" />
        <b>Viewer</b> of.
      </p>
    </div>
    <user-project-list />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import UserProjectList from '../../../components/common/UserProjectsList';

export default {
  components: {
    UserProjectList
  },
  computed: {
    ...mapGetters({
    })
  }
};
</script>

<style lang="less">
  @import "../../../assets/style/variables.less";
  @import "../../../assets/style/mixins.less";

  .MyProjects {
    .PageTitle {
      .svg-inline--fa {
        margin: 0 4px 0 4px;
        width: 16px;
        height: 16px;
      }

      .Owner {
        color: @colorOwner;
      }

      .Viewer {
        color: @colorViewer;
      }
    }
  }

</style>
