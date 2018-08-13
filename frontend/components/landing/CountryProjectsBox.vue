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
            @tab-click="tabChangeHandler"
          >
            <el-tab-pane
              label="Sub-national"
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
  watch: {
    activeCountry: {
      immediate: true,
      handler (value) {
        if (value) {
          this.tabChangeHandler();
        }
      }
    }
  },
  methods: {
    ...mapActions({
      setActiveCountry: 'landing/setActiveCountry'
    }),
    closeCountryProjextBox () {
      this.setActiveCountry(null);
    },
    tabChangeHandler () {
      this.$nextTick(() => {
        const stripe = this.$el.querySelector('.el-tabs__active-bar');
        const tabNameBox = this.$el.querySelector('.el-tabs__item.is-active').getBoundingClientRect();
        const componentBox = this.$el.getBoundingClientRect();
        const stripeWidth = tabNameBox.width - 12;
        const stripeTranslate = tabNameBox.left === 60 ? 0 : Math.ceil(tabNameBox.left - componentBox.left) - 9;
        stripe.style.width = `${stripeWidth}px`;
        stripe.style.transform = `translate(${stripeTranslate}px)`;
      });
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
