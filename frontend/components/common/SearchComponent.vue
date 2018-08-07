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
                v-model="searchString"
                placeholder="Type something">
                <fa
                  slot="prepend"
                  icon="search" />
                <template slot="append">
                  <el-button
                    class="SearchClear"
                    @click="clearSearch"
                  >
                    <fa icon="times" />
                  </el-button>
                  <el-button
                    class="SearchSubmit"
                    @click="search"
                  >
                    <fa icon="arrow-right" />
                  </el-button>
                </template>
              </el-input>
            </el-col>
          </el-row>

          <el-row
            type="flex"
            align="middle"
            class="SearchResultsHeader"
          >
            <el-col
              v-show="hasResults"
              class="SearchResultsCounter"
            >
              {{ results.length }} result(s):
            </el-col>
            <el-col class="AdvancedSearch">
              <nuxt-link
                class="NuxtLink IconRight"
                to="dashboard"
              ><span>Advanced search</span><fa icon="angle-right" />
              </nuxt-link>
            </el-col>
          </el-row>

          <el-row v-show="!hasResults">
            <el-col class="SearchResultsNope">
              <p class="TipText">
                <fa
                  icon="info-circle"
                  size="lg" />
                <span>Short tip text about advenacd seacrh lorem ipsum dolor sit ametncidunt ut labore et dolore magna aliqua.</span>
              </p>
            </el-col>
          </el-row>

          <el-row
            v-for="project in results"
            v-show="hasResults"
            :key="project"
            class="SearchResultItem"
          >
            <el-col>
              <project-card search-child />
            </el-col>
          </el-row>
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
            {{ results.length }} results
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
import ProjectCard from './ProjectCard';
import ClickOutside from 'vue-click-outside';

export default {
  directives: {
    ClickOutside
  },
  components: {
    ProjectCard
  },
  data () {
    return {
      shown: false,
      searchString: null,
      results: []
    };
  },
  computed: {
    hasResults () {
      return this.results.length > 0;
    }
  },
  methods: {
    clearSearch () {
      this.searchString = null;
      this.results = [];
    },
    search () {
      this.results = [1, 2, 3];
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
    z-index: 1010;
    width: 400px;
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
        width: @actionBarHeight * 2;
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
        border: 0;
        background-color: @colorGrayLightest;

        .svg-inline--fa {
          font-size: 18px;
        }

        &:hover {
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

    .SearchResultsHeader {
      height: 56px;
      padding: 0 20px;
      border-top: 1px solid @colorTextMuted;

      .SearchResultsCounter {
        width: 100%;
        font-size: @fontSizeSmall;
        font-weight: 700;
        color: @colorTextSecondary;
        text-transform: uppercase;
      }

      .AdvancedSearch {
        width: auto;
      }
    }

    .SearchResultsNope {
      padding: 0 20px 30px;

      .TipText {
        display: inline-flex;
        align-items: flex-start;
        margin: 0;
        font-size: @fontSizeSmall;
        line-height: 18px;
        color: @colorTextSecondary;

        .svg-inline--fa {
          margin-right: 6px;
          color: @colorTextMuted;
        }
      }
    }

    .SearchResultItem {
      margin: 0 20px 12px;
      cursor: pointer;

      &:last-child {
        margin-bottom: 20px;
      }
    }
  }

  .SearchShadow {
    width: 400px;
    height: @actionBarHeight;
    background-color: @colorGrayLightest;

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
          border: 0;
          background-color: @colorGrayLightest;
          color: @colorTextMuted;

          .svg-inline--fa {
            font-size: 18px;
          }

          &:hover {
            color: @colorTextPrimary;
          }
        }
      }
    }
  }
</style>
