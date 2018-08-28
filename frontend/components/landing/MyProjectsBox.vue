<template>
  <div class="MyProjectsBox">
    <el-row
      type="flex"
      align="middle"
      class="ProjectsBoxHeadline">
      <el-col>
        <h2>My Projects</h2>
        <h6>
          Here you can find a list of the last 3 projects<br>
          which have been updated recently:
        </h6>
      </el-col>
    </el-row>

    <user-projects-list />

    <el-row
      v-if="userProjecList.length > 0"
      type="flex"
      class="SeeAllMyProjects"
    >
      <el-col>
        <nuxt-link
          :to="localePath('index-projects')"
          tag="button"
          class="el-button el-button--default el-button--medium">
          See all my projects
        </nuxt-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import UserProjectsList from '../common/UserProjectsList';
export default {
  components: {
    UserProjectsList
  },
  computed: {
    ...mapGetters({
      userProjecList: 'projects/getUserProjectList'
    })
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .MyProjectsBox {
    height: 100%;
    background-color: @colorWhite;

    .ProjectsBoxHeadline {
      position: relative;
      height: 172px;
      text-align: center;
      background-color: @colorBrandPrimary;

      &::after {
        content: "";
        z-index: 100;
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        display: block;
        width: 0;
        height: 0;
        border-left: 24px solid transparent;
        border-right: 24px solid transparent;
        border-top: 24px solid @colorBrandPrimary;
      }

      h2 {
        color: @colorWhite;
        margin: 0 0 16px;
      }

      h6 {
        color: @colorWhite;
        margin: 0;
      }
    }

    .UserProjectsList {
      .NuxtLink {
        margin-left: 30px;
        font-size: @fontSizeSmall;
      }
    }

    .SeeAllMyProjects {
      text-align: center;
    }
  }

</style>
