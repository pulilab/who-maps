<template>
  <div class="ActionBar">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      class="InnerActionBar">

      <el-col class="Title">
        <h3>Digital Health Atlas</h3>
      </el-col>

      <el-col class="ActionBarMenu">
        <el-row
          v-if="isAdmin"
          type="flex">
          <el-col class="ActionBarTab">
            <nuxt-link
              :to="localePath({name: 'index-edit-profile'})"
              class="ActionBarLink"
              tag="div">My profile</nuxt-link>
          </el-col>
          <el-col class="ActionBarTab">
            <nuxt-link
              :to="localePath({name: 'index-admin-country'})"
              class="ActionBarLink"
              tag="div">Country admin</nuxt-link>
          </el-col>
          <el-col class="ActionBarTab">
            <nuxt-link
              :to="localePath({name: 'index-admin-donor'})"
              class="ActionBarLink"
              tag="div">Donor admin</nuxt-link>
          </el-col>
        </el-row>
        <el-row
          v-if="isDashboard"
          type="flex">
          <el-col class="ActionBarTab">
            <nuxt-link
              :to="localePath({name: 'index-dashboard'})"
              class="ActionBarLink"
              tag="div">Map view</nuxt-link>
          </el-col>
          <el-col class="ActionBarTab">
            <nuxt-link
              :to="localePath({name: 'index-dashboard-list'})"
              class="ActionBarLink"
              tag="div">List view</nuxt-link>
          </el-col>
        </el-row>
      </el-col>

      <el-col
        v-if="!isDashboard"
        class="SearchComponentWrapper">
        <search-component />
      </el-col>
      <template v-if="isDashboard">
        <el-col class="PersonaSelectorWrapper">
          <persona-selector/>
        </el-col>
        <el-col class="DashboardFiltersHeaderWrapper">
          <dashboard-filters-header/>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import SearchComponent from '../common/SearchComponent.vue';
import PersonaSelector from '../dashboard/PersonaSelector';
import DashboardFiltersHeader from '../dashboard/DashboardFiltersHeader';

export default {
  components: {
    SearchComponent,
    PersonaSelector,
    DashboardFiltersHeader
  },
  computed: {
    isAdmin () {
      return this.$route.path.includes('/admin');
    },
    isDashboard () {
      return this.$route.path.includes('/dashboard');
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .ActionBar {
    background-color: @colorBrandPrimary;

    .InnerActionBar {
      .limitPageWidth();
      height: @actionBarHeight;
    }

    .Title {
      width: auto;

      h3 {
        display: inline-block;
        margin: 0;
        font-size: @fontSizeLarge;
        color: @colorWhite;
        white-space: nowrap;
      }
    }

    .SearchComponentWrapper {
      width: auto;
    }

    .ActionBarMenu {
      width: 100%;
      height: @actionBarHeight;
      padding-left: 70px;
      overflow: hidden;

      .ActionBarTab {
        width: auto;
      }
    }

    .ActionBarLink {
      position: relative;
      width: auto;
      height: 100%;
      margin-right: 10px;
      padding: 0 10px;
      font-size: @fontSizeBase;
      line-height: @actionBarHeight;
      font-weight: 700;
      color: @colorWhite;
      text-decoration: none;
      cursor: pointer;
      white-space: nowrap;
      opacity: .6;
      transition: @transitionAll;

      &.nuxt-link-exact-active {
        opacity: 1;

        &::before {
          background-color: @colorWhite;
          transform: translateY(0);
        }
      }

      &::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        display: inline-block;
        width: 100%;
        height: 4px;
        background-color: @colorWhite;
        transform: translateY(4px);
        transition: @transitionAll;
      }

      &:hover {
        opacity: 1;

        &::before {
          transform: translateY(0);
        }
      }
    }
  }
</style>
