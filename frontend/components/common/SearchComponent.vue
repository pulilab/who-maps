<template>
  <div
    v-click-outside="hide"
    class="SearchComponent"
  >
    <transition name="el-fade-in">
      <div
        v-show="shown"
        class="SearchPopper"
      >
        <el-card :body-style="{ padding: '0px' }">
          <el-row
            type="flex"
            class="SearchBig"
          >
            <el-col :span="24">
              <el-input
                ref="searchInput"
                v-model="localSearchString"
                :placeholder="$gettext('Create your search here') | translate"
                @keyup.enter.native="search"
              >
                <fa
                  slot="prepend"
                  icon="search"
                />
                <template slot="append">
                  <el-button
                    class="SearchClear"
                    @click="clearSearch"
                  >
                    <fa icon="times" />
                  </el-button>
                </template>
              </el-input>
            </el-col>
          </el-row>

          <div class="SearchResultTop">
            <el-row
              v-if="localSearchString"
              type="flex"
              align="middle"
              class="SearchResultsHeader HasResults"
            >
              <template>
                <el-col class="SearchResultsCounter">
                  <translate :parameters="{num: resultCount}">
                    Show {num} result(s):
                  </translate>
                </el-col>
                <el-col class="AdvancedSearchLink">
                  <nuxt-link
                    :to="localePath({name : 'organisation-cms', params: $route.params})"
                    class="NuxtLink IconRight"
                  >
                    <span><translate>Planning & Guidance</translate></span><fa icon="angle-right" />
                  </nuxt-link>
                  <nuxt-link
                    :to="localePath({name : 'organisation-dashboard', params: $route.params})"
                    class="NuxtLink IconRight"
                  >
                    <span><translate>Dashboard</translate></span><fa icon="angle-right" />
                  </nuxt-link>
                </el-col>
              </template>
            </el-row>

            <template v-else>
              <SearchComponentLink
                :title="$gettext('Go to Advanced project search') | translate"
                :text="$gettext('You can use filters to further refine your search. Note that these filters can be saved by selecting Filters and naming your filter. These can then be viewed at a later time after you log in.') | translate"
                page="organisation-dashboard"
                class="FirstSearchComponent"
              />
              <SearchComponentLink
                :title="$gettext('Go to Planning & Guidance') | translate"
                :text="$gettext('Salutantibus vitae elit libero, a pharetra augue. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh.') | translate"
                page="organisation-cms"
                class="LastSearchComponent"
              />
            </template>
          </div>

          <el-tabs
            v-if="localSearchString"
            v-model="activeSearchTab"
            class="SearchTabs"
          >
            <el-tab-pane
              :label="$gettext('Projects {num}', {num: results.length}) | translate"
              name="projects"
            >
              <el-row v-show="!resultsLoaded">
                <div class="Loading">
                  <Spinner size="22" />
                  <translate>Loading...</translate>
                </div>
              </el-row>
              <el-row v-show="resultsLoaded && results.length === 0">
                <div class="Loading">
                  <translate>No project to show</translate>
                </div>
              </el-row>
              <div
                v-show="resultsLoaded && results.length > 0"
                class="SearchResultsWrapper"
              >
                <el-row
                  v-for="project in results"
                  :key="project.id"
                  class="SearchResultItem"
                >
                  <el-col>
                    <project-card
                      :project="project"
                      :found-in="getFoundIn(project.id)"
                      :link-active="false"
                      show-found-in
                      show-country
                      show-organisation
                      show-arrow-on-over
                      @redirect="reset"
                    />
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="$gettext('Planning & guidance {num}', {num: cms ? cms.length : 0}) | translate"
              name="planning"
            >
              <el-row v-if="cms === null">
                <div class="Loading">
                  <Spinner size="22" />
                  <translate>Loading...</translate>
                </div>
              </el-row>
              <el-row v-else-if="cms.length === 0">
                <div class="Loading">
                  <translate>No content to show</translate>
                </div>
              </el-row>
              <div
                v-else
                class="SearchResultsWrapper"
              >
                <el-row
                  v-for="project in cms"
                  :key="project.id"
                  class="SearchResultItem"
                >
                  <el-col>
                    <project-card-planning
                      :project="project"
                      show-arrow-on-over
                      @redirect="reset"
                    />
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="$gettext('Ministry of Health {num}', {num: documents ? documents.length : 0}) | translate"
              name="documents"
            >
              <el-row v-if="documents === null">
                <div class="Loading">
                  <Spinner size="22" />
                  <translate>Loading...</translate>
                </div>
              </el-row>
              <el-row v-else-if="documents.length === 0">
                <div class="Loading">
                  <translate>No document to show</translate>
                </div>
              </el-row>
              <div
                v-else
                class="SearchResultsWrapper"
              >
                <el-row
                  v-for="project in documents"
                  :key="project.id"
                  class="SearchResultItem"
                >
                  <el-col>
                    <project-card-documents
                      :project="project"
                      show-arrow-on-over
                    />
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </transition>

    <el-button
      v-show="!shown && !searchString"
      class="SearchButton"
      @click="show"
    >
      <fa icon="search" />
    </el-button>

    <div
      v-show="searchString && !shown"
      class="SearchShadow"
      @click="show"
    >
      <el-row
        type="flex"
        align="middle"
      >
        <el-col>
          <fa icon="search" />
        </el-col>
        <el-col>
          <span class="SearchText">
            {{ searchString }}
          </span>
        </el-col>
        <el-col>
          <span class="SearchResultsCounter">
            <translate :parameters="{num: resultCount}">
              {num} result(s)
            </translate>
          </span>
        </el-col>
        <el-col>
          <el-button
            @click.prevent.stop="clearSearch"
          >
            <fa icon="times" />
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import { mapGettersActions } from '@/utilities/form';
import ProjectCard from '@/components/common/ProjectCard';
import ProjectCardPlanning from '@/components/common/ProjectCardPlanning';
import ProjectCardDocuments from '@/components/common/ProjectCardDocuments';
import SearchComponentLink from '@/components/common/SearchComponentLink';
import Spinner from '@/components/common/Spinner';
import ClickOutside from 'vue-click-outside';
import { mapGetters, mapActions } from 'vuex';

export default {
  directives: {
    ClickOutside
  },
  components: {
    ProjectCardDocuments,
    ProjectCardPlanning,
    ProjectCard,
    SearchComponentLink,
    Spinner
  },
  data () {
    return {
      localSearchString: '',
      shown: false,
      activeSearchTab: 'projects'
    };
  },
  computed: {
    ...mapGetters({
      searchParameters: 'landing/getSearchParameters',
      results: 'landing/getSearchResult',
      getFoundIn: 'landing/getFoundIn',
      resultsLoaded: 'landing/getLoaded',
      cms: 'landing/getCMS',
      documents: 'landing/getDocuments'
    }),
    ...mapGettersActions({
      searchString: ['landing', 'getSearchString', 'setSearchString', 0]
    }),
    resultCount () {
      return (this.results ? this.results.length : 0) +
        (this.cms ? this.cms.length : 0);
    }
  },
  watch: {
    localSearchString: {
      immediate: false,
      handler: function () {
        if (this.localSearchString.length > 0 && this.localSearchString.length < 3) {
          return;
        }
        this.$store.commit('landing/SET_LOADED', false);
        this.search();
        if (this.cms) {
          this.doCMSSearch();
        }
        this.updateSearch();
      }
    }
  },
  methods: {
    ...mapActions({
      doSearch: 'landing/search',
      doCMSSearch: 'landing/cmsSearch',
      doDocumentSearch: 'landing/documentSearch',
      clearPage: 'landing/clearCustomLandingPage',
      resetSearch: 'landing/resetSearch'
    }),
    updateSearch: debounce(function () {
      this.doCMSSearch();
      setTimeout(() => {
        this.doDocumentSearch();
        this.doSearch();
      }, 0);
    }, 500),
    reset () {
      this.clearSearch();
      this.hide();
    },
    clearSearch () {
      this.localSearchString = '';
      this.$refs.searchInput.focus();
    },
    search () {
      this.searchString = this.localSearchString;
    },
    show () {
      this.shown = true;
    },
    hide () {
      this.shown = false;
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .SearchComponent {
    .SearchButton {
      width: @actionBarHeight;
      height: @actionBarHeight;
      padding: 0;
      margin: 0;
      text-align: center;
      color: @colorWhite;

      .svg-inline--fa {
        font-size: 20px;
        color: @colorWhite;
      }
    }
  }

  .SearchPopper {
    position: absolute;
    right: 40px;
    top: 0;
    z-index: 2010;
    width: 500px;
    box-shadow: 5px 5px 20px 10px rgba(0,0,0,.15);

    > .el-card {
      padding: 0;
      border: 0;
      background-color: fade(@colorGrayLightest, 90%);
    }

    .SearchBig {
      height: @actionBarHeight;

      .el-input,
      .el-input__inner {
        width: 100%;
        height: @actionBarHeight;
        font-size: @fontSizeBase;
        font-weight: 700;
      }

      .el-input__inner,
      .el-input-group__prepend,
      .el-input-group__append {
        border: none !important;
      }

      .el-input-group__prepend {
        width: 38px;
        height: @actionBarHeight;
        padding: 0;
        background-color: @colorWhite;

        .svg-inline--fa {
          float: right;
          font-size: 20px;
          color: @colorTextPrimary;
        }
      }

      .el-input-group__append {
        width: @actionBarHeight; // * 2;
        height: @actionBarHeight;
        padding: 0;

        .el-button {
          width: @actionBarHeight;
          height: @actionBarHeight;
          margin: 0;
          padding: 0;
        }
      }

      .SearchClear {
        background-color: @colorGrayLightest;

        .svg-inline--fa {
          font-size: 18px;
        }

        &:hover {
          background-color: @colorGrayLighter;
          color: @colorTextPrimary;
        }
      }

      .SearchSubmit {
        border: 0;
        background-color: @colorBrandAccent;

        .svg-inline--fa {
          font-size: 18px;
          color: @colorWhite;
        }

        &:hover {
          background-color: @colorBrandAccentLight;
        }
      }
    }

    .Loading {
      padding: 22px 20px;
      color: #008DC9;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0;
    }

    .SearchResultsWrapper {
      padding-top: 16px;
      // max-height: calc(@landingMapHeight - 36px);
      max-height: calc(@landingMapHeight);
      overflow-y: auto;

      @media screen and (max-height: 694px) {
        // max-height: calc(@landingMapMinHeight - 36px);
        max-height: calc(@landingMapMinHeight);
      }
    }

    .SearchResultsHeader {
      height: 76px;
      padding: 0 20px;
      border-top: 1px solid @colorTextMuted;
      &.HasResults {
        background-color: white;
        height: 52px;
      }

      .SearchResultsCounter {
        width: 35%;
        font-size: @fontSizeBase;
        font-weight: 700;
        color: @colorTextSecondary;
      }

      .AdvancedSearchLink {
        width: auto;
        a {
          padding-left: 24px;
        }
      }

      .NopeMessage {
        color: @colorTextSecondary;
        font-weight: bold;
        font-size: 14px;
        padding-bottom: 14px;
      }
    }
    .FirstSearchComponent:first-child {
      padding-top: 20px;
    }
    .LastSearchComponent {
      padding-bottom: 20px;
    }

    .SearchTabs {
      .el-tabs__header {
        margin: 0;
        background-color: white;
        .el-tabs__nav-scroll  {
          padding-left: 22px;
          .el-tabs__item:not(.is-active) {
            color: @colorTextSecondary;
          }
        }
      }
    }
    .SearchResultItem {
      margin: 0 10px 8px;
    }
    .SearchResultsHeader + .SearchResultItem {
      margin-top: 8px;
    }
  }

  .SearchShadow {
    position: relative;
    width: 500px;
    height: @actionBarHeight;
    background-color: @colorGrayLightest;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      display: block;
      width: 100%;
      height: 1px;
      background-color: @colorGrayLight;
    }

    .el-col {
      height: @actionBarHeight;

      // search icon
      &:nth-child(1) {
        min-width: 38px;
        max-width: 38px;
        height: @actionBarHeight;

        .svg-inline--fa {
          float: right;
          height: @actionBarHeight;
          font-size: 20px;
          color: @colorTextPrimary;
        }
      }

      // search term
      &:nth-child(2) {
        width: 100%;

        .SearchText {
          color: @colorTextPrimary;
          font-size: @fontSizeBase;
          font-weight: 700;
          line-height: @actionBarHeight;
          padding: 0 15px;
        }
      }

      // search results
      &:nth-child(3) {
        width: auto;

        .SearchResultsCounter {
          padding: 0 15px;
          color: @colorTextMuted;
          font-size: @fontSizeBase;
          font-weight: 700;
          line-height: @actionBarHeight;
          white-space: nowrap;
        }
      }

      // search clear
      &:nth-child(4) {
        width: @actionBarHeight;

        .el-button {
          width: @actionBarHeight;
          height: @actionBarHeight;
          padding: 0;
          background-color: @colorGrayLightest;
          color: @colorTextMuted;

          .svg-inline--fa {
            font-size: 18px;
          }

          &:hover {
            color: @colorTextPrimary;
            background-color: @colorGrayLighter;
          }
        }
      }
    }
  }
</style>
