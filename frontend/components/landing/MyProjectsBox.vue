<template>
  <div class="MyProjectsBox">
    <el-row type="flex" align="middle" class="ProjectsBoxHeadline">
      <el-col>
        <h2><translate>My Projects</translate></h2>
        <h6>
          <translate>Here are your projects updated most recently</translate>
        </h6>
      </el-col>
    </el-row>

    <UserProjectsList :project-list="userProjecList" :limit="3" />

    <el-row
      v-if="userProjecList.length > 0"
      type="flex"
      class="SeeAllMyProjects"
    >
      <el-col>
        <nuxt-link
          :to="localePath({ name: 'organisation-projects', params: $route.params })"
          tag="button"
          class="el-button el-button--accent el-button--medium"
        >
          <translate>See all my projects</translate>
        </nuxt-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import UserProjectsList from '../common/UserProjectsList'
export default {
  components: {
    UserProjectsList
  },
  computed: {
    ...mapGetters({
      userProjecList: 'projects/getUserProjectList'
    })
  },
  mounted() {
    if (this.userProjecList.length === 0) this.loadProjects()
  },
  methods: {
    ...mapActions({
      loadProjects: 'projects/loadUserProjects'
    })
  }
}
</script>

<style lang="less">
@import '../../assets/style/variables.less';
@import '../../assets/style/mixins.less';

.MyProjectsBox {
  height: 100%;
  background-color: @colorWhite;

  .ProjectsBoxHeadline {
    position: relative;
    height: 172px;
    text-align: center;
    background-color: @colorBrandPrimary;

    &::after {
      content: '';
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
    padding-bottom: 40px;
    text-align: center;
  }
}
</style>
