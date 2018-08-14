<template>
  <transition name="el-zoom-in-top">
    <div
      v-if="showMapProjectBox"
      class="MapProjectBox">
      <el-row
        type="flex"
        class="CountryHeader"
      >
        <el-col>
          <country-item :id="activeCountry"/>
        </el-col>
      </el-row>
      <el-row class="CountrySubHeader">
        <div v-if="showSubNational">
          <sub-level-item
            :id="activeSubLevel"
          />
          (5 projects)
        </div>
        <div v-if="showNational" >
          National (3 projects)
        </div>
      </el-row>
      <el-row />
      <el-row class="ProjectsList">
        <el-col>
          <tabbed-card-project-list
            v-if="showTabbedView"
            :active-tab="activeTab"
            @change="tabChangeHandler"
          />
          <div
            v-if="showSubNational"
            class="PlainList SubNational"
          >
            <project-card />
            <project-card />
            <project-card />
            <project-card />
            <project-card />
          </div>
          <div
            v-if="showNational"
            class="PlainList NAtional"
          >
            <project-card />
            <project-card />
            <project-card />
          </div>
          <div class="HintText">
            Select a pin blablabla...
          </div>
        </el-col>
      </el-row>

      <el-button
        circle
        class="CloseBox"
        @click="closeCountryProjextBox"
      >
        <fa icon="times" />
      </el-button>
    </div>
  </transition>
</template>

<script>
import CountryItem from '../CountryItem';
import ProjectCard from '../ProjectCard';

import TabbedCardProjectList from './TabbedCardProjectList';
import SubLevelItem from '../SubLevelItem';

export default {
  components: {
    CountryItem,
    TabbedCardProjectList,
    SubLevelItem,
    ProjectCard
  },
  props: {
    selectedCountry: {
      type: Number,
      default: null
    },
    activeCountry: {
      type: Number,
      default: null
    },
    activeTab: {
      type: String,
      required: true
    },
    activeSubLevel: {
      type: String,
      default: null
    }
  },
  computed: {
    showTabbedView () {
      return this.activeCountry && !this.selectedCountry;
    },
    showSubNational () {
      return !this.showTabbedView &&
      this.activeTab === 'subNational' &&
      this.activeSubLevel;
    },
    showNational () {
      return !this.showTabbedView &&
      this.activeTab === 'national';
    },
    showMapProjectBox () {
      return this.activeCountry;
    }
  },
  methods: {
    closeCountryProjextBox () {
      this.$emit('update:ActiveCountry', null);
    },
    tabChangeHandler (tab) {
      this.$emit('update:activeTab', tab.name);
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .MapProjectBox {
      z-index: 400;
      position: absolute;
      top: 40px;
      left: 40px;
      box-sizing: border-box;
      width: 360px;
      height: auto;
      max-height: 420px;
      color: @colorWhite;
      background: fade(@colorGrayLightest, 90%);
      box-shadow: 5px 5px 20px 0 rgba(0,0,0,0.15);

      .CountryHeader {
        padding: 20px 20px 0;
        background-color: @colorWhite;
      }

      .ProjectsList {
        .el-tabs__header {
          margin: 0;
          background-color: @colorWhite;

          .el-tabs__nav-wrap {
            padding: 0 20px;
          }
        }

        .el-tabs__item {
          // Changes to this padding value will require a change on the JS too.
          padding: 0 12px;
        }
        .el-tabs__content {
          padding: 20px;

          .ProjectCard {
            margin: 0 0 8px;

            &:last-child {
              margin: 0;
            }
          }
        }
      }

      .CloseBox {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 40px;
        height: 40px;
        color: @colorTextSecondary;
        border: none !important;
        background-color: @colorWhite !important;

        &:hover {
          color: @colorTextPrimary;
        }
      }
    }

</style>
