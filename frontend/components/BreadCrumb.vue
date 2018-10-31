<template>
  <el-col class="Breadcrumb">
    <!-- TODO: Zoli -->
    <!-- Fix this on landing page, without the subpage part it breaks the positioning, with longer subpages names it breaks as well -->
    <el-row
      type="flex"
      align="middle">
      <el-col class="Home">
        <nuxt-link
          :to="localePath({name: 'organisation', params: $route.params})"
        >
          <fa
            icon="home"
            size="lg" />
        </nuxt-link>
      </el-col>
      <template
        v-if="subPageName"
      >
        <el-col class="Sep" >
          <fa icon="angle-right" />
        </el-col>
        <el-col
          :key="subPageName"
          class="Page">
          {{ subPageName }}
        </el-col>
      </template>
    </el-row>
  </el-col>
</template>

<script>
export default {
  computed: {
    pureRoute () {
      return this.$route.name.split('___')[0];
    },
    subPageName () {
      const pages = {
        'organisation-edit-profile': this.$gettext('User'),
        'organisation-admin-country': this.$gettext('Admin'),
        'organisation-admin-donor': this.$gettext('Admin'),
        'organisation-dashboard': this.$gettext('Dashboard'),
        'organisation-dashboard-list': this.$gettext('Dashboard'),
        'organisation-projects': this.$gettext('My Projects'),
        'organisation-projects-id-published': this.$gettext('Published Project'),
        'organisation-projects-id-edit': this.$gettext('Edit Project'),
        'organisation-projects-id': this.$gettext('Drafted Project'),
        'organisation-cms': this.$gettext('Planning and Guidance'),
        'organisation-projects-create': this.$gettext('New Project'),
        'organisation-projects-id-assessment': this.$gettext('Assessment'),
        'organisation-projects-id-toolkit': this.$gettext('Toolkit'),
        'organisation-projects-id-toolkit-scorecard': this.$gettext('Toolkit')
      };
      const match = pages[this.pureRoute];
      if (!match) {
        console.error('Missing subpage key for breadcrumb');
      }
      return match;
    }
  }
};
</script>

<style lang="less">
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";
.Breadcrumb {
  width: auto;
  height: @actionBarHeight;
  color: @colorWhite;

  .Home {
    transform: translateY(-1px);
    a {
      text-decoration: none;
      color: @colorWhite;
    }
  }

  .Sep {
    margin: 0 5px;
    padding: 0 10px;
    transform: translateY(1px);
  }

  .Page {
    font-size: @fontSizeBase;
    line-height: @actionBarHeight;
    font-weight: 700;
  }

  // h3 {
  //   display: inline-block;
  //   margin: 0;
  //   font-size: @fontSizeLarge;
  //   color: @colorWhite;
  //   white-space: nowrap;
  // }
}
</style>
