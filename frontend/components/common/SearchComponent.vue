<template>
  <div
    v-click-outside="hide"
    class="SearchComponent"
  >
    <div
      v-show="shown"
      class="SearchPopper"
    >
      <el-card>
        <el-row type="flex">
          <el-col :span="24">
            <el-input
              v-model="searchString"
              placeholder="Type something">
              <i
                slot="prepend"
                class="el-icon-search"
              />
              <template slot="append">
                <el-button
                  icon="el-icon-close"
                  @click="clearSearch"
                />
                <el-button
                  icon="el-icon-arrow-right"
                  @click="search"
                />
              </template>
            </el-input>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col v-show="hasResults">
            {{ results.length }} results
          </el-col>
          <el-col>
            <nuxt-link to="dashboard"> Advanced search > </nuxt-link>
          </el-col>
        </el-row>

        <el-row v-show="!hasResults">
          <el-col >
            <p class="TipText">
              Short tip text about advenacd seacrh lorem ipsum dolor sit ametncidunt ut labore et dolore magna aliqua.
            </p>
          </el-col>
        </el-row>
        <el-row
          v-for="project in results"
          v-show="hasResults"
          :key="project"
        >
          <el-col>
            <project-card search-child/>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <el-button
      v-show="!shown && !searchString"
      icon="el-icon-search"
      @click="show"
    />
    <div
      v-show="searchString && !shown"
      class="SearchShadow"
      @click="show"
    >
      <el-row type="flex">
        <el-col>
          <i class="el-icon-search" />
        </el-col>
        <el-col>
          <span class="SearchText">
            {{ searchString }}
          </span>
        </el-col>
        <el-col>
          <span class="SearchResults">
            {{ results.length }} results
          </span>
        </el-col>
        <el-col>
          <el-button
            icon="el-icon-close"
            @click.prevent.stop="clearSearch"
          />
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
    padding: 0 10px;

    .el-icon-search {
      font-size: 24px;
      color: @colorWhite;
    }

    .SearchShadow {
      width: 400px;
    }
  }
  .SearchPopper {
    position: absolute;
    right: 60px;
    top: 0;
    z-index: 1010;
    width: 400px;
  }
</style>
