<template>
  <div class="ActionBar">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      class="InnerActionBar">

      <el-col class="Breadcrumb">
        <el-row
          type="flex"
          align="middle">
          <el-col class="Home">
            <!-- TODO -->
            <!-- This must go to landing page always -->
            <fa
              icon="home"
              size="lg" />
          </el-col>
          <!-- TODO -->
          <!-- Show this only if it's a subpage, i assume this gonna be a new component -->
          <el-col class="Sep">
            <fa icon="angle-right" />
          </el-col>
          <el-col class="Page">Subpage</el-col>
        </el-row>
      </el-col>

      <el-col class="ActionBarTabs">
        <el-row
          v-if="isAdmin"
          type="flex"
          align="middle">
          <el-col class="Sep">
            <fa icon="angle-right" />
          </el-col>
          <el-col class="ActionBarTab">
            <nuxt-link
              :to="localePath({name: 'organisation-edit-profile', params: $route.params})"
              class="ActionBarLink"
              tag="div">
              <translate key="my-profile">My profile</translate>
            </nuxt-link>
          </el-col>
          <el-col class="ActionBarTab">
            <nuxt-link
              v-if="allowCountryAdmin"
              :to="localePath({name: 'organisation-admin-country', params: $route.params})"
              class="ActionBarLink"
              tag="div">
              <translate key="country-admin">Country admin</translate>
            </nuxt-link>
          </el-col>
          <el-col class="ActionBarTab">
            <nuxt-link
              v-if="allowDonorAdmin"
              :to="localePath({name: 'organisation-admin-donor', params: $route.params})"
              class="ActionBarLink"
              tag="div">
              <translate key="donor-admin">Donor admin</translate>
            </nuxt-link>
          </el-col>
        </el-row>
        <el-row
          v-if="isDashboard"
          type="flex"
          align="middle">
          <el-col class="Sep">
            <fa icon="angle-right" />
          </el-col>
          <el-col class="ActionBarTab">
            <nuxt-link
              :to="localePath({name: 'organisation-dashboard', params: $route.params, query: $route.query})"
              :class="['ActionBarLink', {'Active': isMapSubRoute}]"
              tag="div">
              <translate key="map-view">Map view</translate>
            </nuxt-link>
          </el-col>
          <el-col class="ActionBarTab">
            <nuxt-link
              :to="localePath({name: 'organisation-dashboard-list', params: $route.params, query: $route.query})"
              :class="['ActionBarLink', {'Active': isListSubRoute}]"
              tag="div">
              <translate key="list-view">List view</translate>
            </nuxt-link>
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
import { mapGetters } from 'vuex';
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
    ...mapGetters({
      userProfile: 'user/getProfile'
    }),
    isAdmin () {
      return this.$route.path.includes('/admin') || this.$route.path.endsWith('/edit-profile');
    },
    allowCountryAdmin () {
      if (this.userProfile) {
        return (['CA', 'SCA'].includes(this.userProfile.account_type) && this.userProfile.account_type_approved) || this.userProfile.is_superuser;
      }
    },
    allowDonorAdmin () {
      if (this.userProfile) {
        return (['DA', 'SDA'].includes(this.userProfile.account_type) && this.userProfile.account_type_approved) || this.userProfile.is_superuser;
      }
    },
    isDashboard () {
      return this.$route.path.includes('/dashboard');
    },
    isMapSubRoute () {
      return this.$route.name.includes('organisation-dashboard___');
    },
    isListSubRoute () {
      return this.$route.name.includes('organisation-dashboard-list___');
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

    .Breadcrumb {
      width: auto;
      height: @actionBarHeight;
      color: @colorWhite;

      .Home {
        transform: translateY(-1px);
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

    .SearchComponentWrapper {
      width: auto;
    }

    .PersonaSelectorWrapper {
      width: auto;
    }

    .DashboardFiltersHeaderWrapper {
      min-width: @advancedSearchWidth;
      max-width: @advancedSearchWidth;
    }

    .ActionBarTabs {
      width: 100%;
      height: @actionBarHeight;
      overflow: hidden;

      .Sep {
        width: auto;
        margin: 0 5px;
        padding: 0 10px;
        color: @colorWhite;
        transform: translateY(1px);
      }

      .ActionBarTab {
        width: auto;
      }
    }

    .ActionBarLink {
      position: relative;
      width: auto;
      height: 100%;
      margin: 0 10px;
      padding: 0 10px;
      font-size: @fontSizeBase;
      line-height: @actionBarHeight;
      font-weight: 700;
      color: @colorWhite;
      text-decoration: none;
      cursor: pointer;
      white-space: nowrap;
      opacity: .8;
      transition: @transitionAll;

      &:first-child {
        margin-left: 0;
      }

      &.Active, &.nuxt-link-exact-active {
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
        // &::before {
        //   transform: translateY(0);
        // }
      }
    }
  }
</style>
