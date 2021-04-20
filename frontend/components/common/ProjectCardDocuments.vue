<template>
  <el-card
    :body-style="{ padding: hideBorders ? '0px' : '12px' }"
    :class="['ProjectCard', 'rounded', { hovered, HideBorders: hideBorders }]"
    :shadow="cardShadow"
  >
    <div
      class="DocumentCard"
      @click="openFile"
      @mouseenter="mouseEnterHandler"
      @mouseleave="mouseLeaveHandler"
    >
      <el-row type="flex">
        <el-col :span="22">
          <el-row class="ProjectName">
            <el-col>
              {{ project.title }}
            </el-col>
          </el-row>

          <el-row type="flex" class="ProjectCountryOrg">
            <el-col class="Country">
              <country-item :id="project.country" :active="false" />
            </el-col>
            <el-col class="Organisation">
              &nbsp;<translate>Ministry of Health</translate>
            </el-col>
          </el-row>

          <el-row type="flex" class="FoundIn">
            <el-col>
              <fa icon="file" size="xs" />
              <span>
                {{ shortUrl }}
              </span>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="2">
          <transition name="el-fade-in">
            <fa v-show="showArrow" icon="download" class="DownloadIcon" />
          </transition>
          <project-legend :id="project.id" />
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import ProjectLegend from "./ProjectLegend";
import CountryItem from "./CountryItem";

export default {
  components: {
    ProjectLegend,
    CountryItem
  },
  props: {
    project: {
      type: Object,
      default: () => ({})
    },
    hideBorders: {
      type: Boolean,
      default: false
    },
    showArrowOnOver: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hovered: false
    };
  },
  computed: {
    cardShadow() {
      return this.hideBorders ? "never" : "always";
    },
    showArrow() {
      return this.hovered && this.showArrowOnOver;
    },
    shortUrl() {
      return this.project.document.replace("documents/", "");
    }
  },
  methods: {
    openFile() {
      window.open("/media/" + this.project.document);
    },
    mouseEnterHandler() {
      this.hovered = true;
    },
    mouseLeaveHandler() {
      this.hovered = false;
    }
  }
};
</script>

<style lang="less">
@import "../../assets/style/variables.less";
@import "../../assets/style/mixins.less";
.DocumentCard {
  .ProjectCard {
    cursor: pointer;

    .ProjectCountryOrg .Country {
      padding-right: 0;
      .CountryItem .CountryName {
        color: @colorTextPrimary;
      }
      &::after {
        display: none;
      }
    }

    &.HideBorders {
      border: none;
      background-color: transparent;

      .ProjectName {
        color: @colorBrandPrimary;
        font-size: @fontSizeSmall;
        line-height: inherit;
      }

      .ProjectCountryOrg {
        margin: 0;
      }
    }

    &.hovered {
      border-color: @colorTextMuted;

      .ProjectName {
        color: @colorBrandPrimary;
      }

      .ProjectCountryOrg,
      .MainText {
        color: @colorTextPrimary;
      }

      .ProjectLegend {
        opacity: 0;
      }
    }

    .el-col {
      position: relative;
    }

    .MainText {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-top: 5px;
      max-height: 36px;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
      line-height: 18px;
      color: @colorTextSecondary;
      transition: @transitionAll;
    }

    .ProjectName {
      padding-right: 12px;
      font-size: @fontSizeBase;
      line-height: 20px;
      font-weight: 700;
      color: @colorTextPrimary;
      transition: @transitionAll;

      & > div {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .FoundIn {
      margin-top: 6px;
      font-size: @fontSizeSmall;
      color: @colorTextMuted;

      .svg-inline--fa {
        position: relative;
        top: -1px;
        margin-right: 4px;
      }
    }

    .ProjectLegend {
      position: absolute;
      top: 0;
      right: 6px;
    }
  }
  .DownloadIcon {
    position: absolute;
    top: 50%;
    right: 6px;
    transform: translateY(-50%);
    color: @colorBrandPrimary;
  }
}
</style>
