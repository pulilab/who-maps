<template>
  <transition name="el-zoom-in-top">
    <div
      v-if="activeCountry"
      class="CountryProjectsBox">
      <el-row
        type="flex"
        class="CountryHeader"
      >
        <el-col>
          <country-item :id="activeCountry"/>
        </el-col>
      </el-row>
      <el-row class="ProjectsList">
        <el-col>
          <el-tabs
            v-model="activeTab"
          >
            <!-- TODO -->
            <!-- Are we able to change the calculation of '.el-tabs__item .is-top' width as the '.el-tabs__item' has 'padding: 0 12px'? -->
            <el-tab-pane
              label="Sub-National"
              name="subNational">
              <project-card />
              <project-card />
              <project-card />
            </el-tab-pane>
            <el-tab-pane
              label="National"
              name="National">
              <project-card />
              <project-card />
            </el-tab-pane>
          </el-tabs>
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
import { mapGetters, mapActions } from 'vuex';
import CountryItem from '../common/CountryItem';
import ProjectCard from '../common/ProjectCard';

export default {
  components: {
    CountryItem,
    ProjectCard
  },
  data () {
    return {
      activeTab: 'subNational'
    };
  },
  computed: {
    ...mapGetters({
      activeCountry: 'landing/getActiveCountry'
    })
  },
  methods: {
    ...mapActions({
      setActiveCountry: 'landing/setActiveCountry'
    }),
    closeCountryProjextBox () {
      this.setActiveCountry(null);
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .CountryProjectsBox {
      z-index: 400;
      position: absolute;
      top: 40px;
      left: 40px;
      box-sizing: border-box;
      width: 360px;
      height: auto;
      max-height: 420px;
      color: @colorWhite;
      background: fade(@colorWhite, 90%);
      box-shadow: 5px 5px 20px 0 rgba(0,0,0,0.15);

      .CountryHeader {
        padding: 15px 12px 0;
        background-color: @colorWhite;
      }

      .ProjectsList {
        .el-tabs__header {
          margin: 0;
          background-color: @colorWhite;

          .el-tabs__nav-wrap {
            padding: 0 12px;
          }

          .el-tabs__item {
            font-size: @fontSizeSmall;
          }
        }
        .el-tabs__content {
          padding: 12px;

          .ProjectCard {
            margin: 0 0 12px;
          }
        }
      }

      .CloseBox {
        position: absolute;
        top: 4px;
        right: 4px;
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
