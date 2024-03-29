<template>
  <div class="ActionBar">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      class="InnerActionBar"
    >
      <bread-crumb />

      <el-col class="ActionBarTabs">
        <el-row
          v-if="isAdmin"
          type="flex"
          align="middle"
        >
          <el-col class="Sep">
            <fa icon="angle-right" />
          </el-col>
          <el-col class="ActionBarTab">
            <nuxt-link
              :to="localePath({name: 'organisation-edit-profile', params: $route.params})"
              class="ActionBarLink"
              tag="div"
            >
              <translate key="my-profile">
                My profile
              </translate>
            </nuxt-link>
          </el-col>
          <el-col class="ActionBarTab">
            <nuxt-link
              v-if="allowSuperCountryAdmin"
              :to="localePath({name: 'organisation-admin-reference-documents', params: $route.params})"
              class="ActionBarLink"
              tag="div"
            >
              <translate key="reference-documents-admin">
                Reference Documents Admin
              </translate>
            </nuxt-link>
          </el-col>
          <el-col class="ActionBarTab">
            <nuxt-link
              v-if="allowCountryAdmin"
              :to="localePath({name: 'organisation-admin-country', params: $route.params})"
              class="ActionBarLink"
              tag="div"
            >
              <translate key="country-admin">
                Country admin
              </translate>
            </nuxt-link>
          </el-col>
          <el-col class="ActionBarTab">
            <nuxt-link
              v-if="allowDonorAdmin"
              :to="localePath({name: 'organisation-admin-donor', params: $route.params})"
              class="ActionBarLink"
              tag="div"
            >
              <translate key="donor-admin">
                Investor admin
              </translate>
            </nuxt-link>
          </el-col>
          <el-col v-if="'organisation-admin-import'" class="ActionBarTab">
            <nuxt-link
              :to="localePath({name: 'organisation-admin-import', params: $route.params})"
              class="ActionBarLink"
              tag="div"
            >
              <translate key="import">
                Import interface
              </translate>
            </nuxt-link>
          </el-col>
          <el-col class="ActionBarTab">
            <nuxt-link
              :to="localePath({name: 'organisation-admin-api', params: $route.params})"
              class="ActionBarLink"
              tag="div"
            >
              <translate key="api-key">
                API key
              </translate>
            </nuxt-link>
          </el-col>
        </el-row>
        <el-row
          v-if="isDashboard"
          type="flex"
          align="middle"
        >
          <el-col class="Sep">
            <fa icon="angle-right" />
          </el-col>
          <el-col class="ActionBarTab">
            <nuxt-link
              :to="localePath({name: 'organisation-dashboard', params: $route.params, query: $route.query})"
              :class="['ActionBarLink', {'Active': isMapSubRoute}]"
              tag="div"
            >
              <translate key="map-view">
                Map view
              </translate>
            </nuxt-link>
          </el-col>
          <el-col class="ActionBarTab">
            <nuxt-link
              :to="localePath({name: 'organisation-dashboard-list', params: $route.params, query: $route.query})"
              :class="['ActionBarLink', {'Active': isListSubRoute}]"
              tag="div"
            >
              <translate key="export-view">
                Export View
              </translate>
            </nuxt-link>
          </el-col>
        </el-row>
      </el-col>

      <el-col v-if="!isDashboard && !isProjects && !isAdmin && !isReferenceDocuments" class="SearchComponentWrapper">
        <SearchComponent />
      </el-col>
      <template v-if="isDashboard">
        <el-col class="PersonaSelectorWrapper">
          <persona-selector />
        </el-col>
        <el-col class="DashboardFiltersHeaderWrapper">
          <dashboard-filters-header />
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchComponent from '../common/SearchComponent.vue'
import PersonaSelector from '../dashboard/PersonaSelector'
import DashboardFiltersHeader from '../dashboard/DashboardFiltersHeader'
import BreadCrumb from '../BreadCrumb'

export default {
  components: {
    SearchComponent,
    PersonaSelector,
    DashboardFiltersHeader,
    BreadCrumb
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getProfile'
    }),
    isAdmin () {
      return this.$route.path.includes('/admin') || this.$route.path.endsWith('/edit-profile')
    },
    allowCountryAdmin () {
      if (this.userProfile) {
        return (['CA', 'SCA'].includes(this.userProfile.account_type) && this.userProfile.account_type_approved) || this.userProfile.is_superuser
      }
      return false
    },
    allowDonorAdmin () {
      if (this.userProfile) {
        return (['DA', 'SDA'].includes(this.userProfile.account_type) && this.userProfile.account_type_approved) || this.userProfile.is_superuser
      }
      return false
    },
    allowSuperCountryAdmin () {
      if (this.userProfile) {
        return (this.userProfile.account_type === 'SCA' && this.userProfile.account_type_approved)
      }
      return false
    },
    isReferenceDocuments () {
      return this.$route.path.includes('/reference-documents')
    },
    isDashboard () {
      return this.$route.path.includes('/dashboard')
    },
    isProjects () {
      return this.$route.path.includes('/projects')
    },
    isMapSubRoute () {
      return this.$route.name.includes('organisation-dashboard___')
    },
    isListSubRoute () {
      return this.$route.name.includes('organisation-dashboard-list___')
    }
  }
}
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
      opacity: .7;
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
