<template>
  <div class="SearchDropdown">
    <el-popover
      :visible-arrow="false"
      v-model="shown"
      placement="left"
      popper-class="SearchPopper"
      width="400"
      trigger="click"
    >
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
                @click="hideSearch"
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
          <project-card />
        </el-col>
      </el-row>
      <el-button
        slot="reference"
        icon="el-icon-search"
      />
    </el-popover>
  </div>
</template>

<script>
import ProjectCard from './ProjectCard';

export default {
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
    hideSearch () {
      this.shown = false;
      this.results = [];
    },
    search () {
      this.results = [1, 2, 3];
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .SearchDropdown {
    padding: 0 10px;

    .el-icon-search {
      font-size: 24px;
      color: @colorWhite;
    }
  }
  .SearchPopper {
    transform: translate(75px, 50px);
  }
</style>
