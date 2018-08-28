<template>
  <el-card
    :body-style="{ padding: hideBorders ? '0px' : '12px' }"
    :class="['ProjectCard', 'rounded', {hovered, 'HideBorders': hideBorders}]"
    :shadow="cardShadow"
  >
    <div
      @click="goToProject"
      @mouseenter="mouseEnterHandler"
      @mouseleave="mouseLeaveHandler">
      <el-row type="flex">
        <el-col :span="22">
          <el-row class="ProjectName">
            <el-col>
              Hello Mama
            </el-col>
          </el-row>

          <el-row
            type="flex"
            class="ProjectCountryOrg"
          >
            <el-col
              v-show="showCountry"
              class="Country"
            >
              Sierra Leone
            </el-col>
            <el-col
              v-show="showOrganisation"
              class="Organisation"
            >
              eHealth Africa
            </el-col>
            <el-col
              v-show="showVerified"
              class="Verified"
            >
              <fa icon="check-circle" />
              Verified by country
            </el-col>
          </el-row>

          <el-row
            v-if="showFoundIn"
            type="flex"
            class="FoundIn"
          >
            <el-col>
              <fa
                icon="search"
                size="xs" />
              <span>Found in "ProjectName"</span>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="2">
          <transition name="el-fade-in">
            <fa
              v-show="showArrow"
              icon="arrow-right" />
          </transition>
          <project-legend :id="id" />
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import ProjectLegend from './ProjectLegend';

export default {
  components: {
    ProjectLegend
  },
  props: {
    id: {
      type: Number,
      default: null
    },
    showCountry: {
      type: Boolean,
      default: false
    },
    showOrganisation: {
      type: Boolean,
      default: false
    },
    showFoundIn: {
      type: Boolean,
      default: false
    },
    showVerified: {
      type: Boolean,
      default: false
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
  data () {
    return {
      hovered: false
    };
  },
  computed: {
    cardShadow () {
      return this.hideBorders ? 'never' : 'always';
    },
    showArrow () {
      return this.hovered && this.showArrowOnOver;
    }
  },
  methods: {
    goToProject () {
      const path = this.localePath({name: 'index-projects-id', params: {id: 1}});
      this.$router.push(path);
    },
    mouseEnterHandler () {
      this.hovered = true;
    },
    mouseLeaveHandler () {
      this.hovered = false;
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .ProjectCard {
    cursor: pointer;

    // for MainTable
    &.HideBorders {
      border: none;
      background-color: transparent;

      .ProjectName {
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
      .ProjectCountryOrg {
        color: @colorTextPrimary;
      }
    }

    .el-col {
      position: relative;
    }

    .ProjectName {
      font-size: @fontSizeBase;
      font-weight: 700;
      color: @colorTextPrimary;
      transition: @transitionAll;
    }

    .ProjectCountryOrg {
      margin-top: 6px;
      font-size: @fontSizeSmall;
      color: @colorTextSecondary;
      white-space: nowrap;
      transition: @transitionAll;

      .Country {
        width: auto;
        padding-right: 25px;

        &::after {
          content: "";
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          display: inline-block;
          width: 1px;
          height: 12px;
          background-color: @colorTextSecondary;
        }
      }

      .Organisation {
        position: relative;
        width: 100%;
      }

      .Verified {
        color: @colorApproved;
        font-size: @fontSizeSmall - 2;
        font-weight: 700;
        text-transform: uppercase;
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

    .fa-arrow-right {
      position: absolute;
      top: 50%;
      right: 4px;
      transform: translateY(-50%);
      color: @colorBrandPrimary;
    }
  }
</style>
