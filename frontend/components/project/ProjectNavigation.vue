<template>
  <div
    v-scroll-class:FixedNavigation="360"
    class="ProjectNavigation"
  >
    <el-card :body-style="{ padding: '0px' }">
      <div class="Stepper">
        <ul>
          <!-- TODO -->
          <!-- Add '.active' class -->
          <li>
            <el-button
              type="text"
              @click="scrollTo('general')"
            >
              <span class="Step">
                <fa icon="arrow-right" />
              </span>
              General
            </el-button>
          </li>
          <li>
            <el-button
              type="text"
              @click="scrollTo('implementation')"
            >
              <span class="Step">
                <fa icon="arrow-right" />
              </span>
              Implementation
            </el-button>
          </li>
          <li>
            <el-button
              type="text"
              @click="scrollTo('technology')"
            >
              <span class="Step">
                <fa icon="arrow-right" />
              </span>
              Technology
            </el-button>
          </li>
          <li>
            <el-button
              type="text"
              @click="scrollTo('interoperability')"
            >
              <span class="Step">
                <fa icon="arrow-right" />
              </span>
              Interoperability
            </el-button>
          </li>
          <li>
            <el-button
              type="text"
              @click="scrollTo('country')"
            >
              <span class="Step">
                <fa icon="arrow-right" />
              </span>
              Country Fields
            </el-button>
          </li>
          <li>
            <el-button
              type="text"
              @click="scrollTo('donor')"
            >
              <span class="Step">
                <fa icon="arrow-right" />
              </span>
              Donor Fields
            </el-button>
          </li>
        </ul>
      </div>

      <div class="NavigationActions">
        <el-button
          type="primary"
          size="medium"
        >
          Save draft
        </el-button>
        <el-button
          type="text"
          class="CancelButton"
        >
          Cancel
          <span class="Hint">Go back to Dashboard</span>
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import VueScrollClass from 'vue-scroll-class';
export default {
  directives: {
    'scroll-class': VueScrollClass
  },
  methods: {
    scrollTo (where) {
      window.location.hash = '';
      this.$nextTick(() => {
        this.$router.replace(`#${where}`);
      });
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .ProjectNavigation {
    width: @projectAsideNavWidth;

    &.FixedNavigation {
      // TODO: check browser compatibility for older browsers which do not support 'sticky'!
      position: sticky;
      top: 0;
      left: 0;
    }

    .Stepper {
      ul {
        position: relative;
        list-style: none;
        margin: 20px 0;
        padding: 0;

        @media only screen and (max-height: 700px) {
          margin: 20px 0;
        }

        &::after {
          z-index: 1;
          content: "";
          position: absolute;
          top: 15px;
          left: 45px;
          display: inline-block;
          width: 1px;
          height: calc(100% - 35px);
          background-color: @colorGrayLight;
        }
      }

      li {
        z-index: 2;
        position: relative;
        cursor: pointer;

        &.active,
        &:hover,
        &:active {
          .el-button {
            color: @colorTextPrimary;

            .Step {
              background-color: @colorBrandPrimaryDark;
              border-width: 2px;
            }

            .svg-inline--fa {
              opacity: 1;
              transform: translate3d(-50%, -50%, 0) scale(1) rotate(0deg);
            }
          }
        }

        &.active {
          .el-button {
            font-weight: 700;
          }
        }
      }

      .el-button  {
        position: relative;
        display: block;
        padding: 0 20px 0 70px;
        height: 62px;
        line-height: 62px;
        font-size: @fontSizeMedium;
        font-weight: 400;
        color: @colorTextSecondary;
        text-decoration: none;
        transition: color 200ms ease;

        @media only screen and (max-height: 720px) {
          height: 48px;
          line-height: 48px;
        }

        .Step {
          position: absolute;
          top: 15px;
          left: 30px;
          box-sizing: border-box;
          display: inline-block;
          width: 29px;
          height: 29px;
          border: 6px solid @colorWhite;
          background-color: @colorGrayLight;
          border-radius: 29px;
          color: @colorWhite;
          transition: all 200ms ease;

          @media only screen and (max-height: 720px) {
            top: 8px;
          }

          .svg-inline--fa {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0) scale(0.5) rotate(-90deg);
            display: inline-block;
            width: 14px;
            height: 14px;
            opacity: 0;
            transition: all 300ms ease;
          }
        }
      }
    }

    .NavigationActions {
      padding: 30px;
      border-top: 1px solid @colorGrayLight;
      background-color: @colorBrandBlueLight;
      text-align: center;

      .el-button--primary {
        width: 100%;
        margin: 0 0 20px;
      }

      .CancelButton {
        margin: 0;
      }

    }
  }
</style>
