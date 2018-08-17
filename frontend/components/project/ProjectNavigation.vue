<template>
  <div
    v-scroll-class:FixedNavigation="340"
    class="ProjectNavigation"
  >
    <el-card :body-style="{ padding: '0px' }">
      <div
        v-if="!readonly && !newProject"
        class="Switch"
      >
        Switch view:
        <el-button-group>
          <el-button
            :class="['DraftButton', {'Active': draft}]"
            :disabled="draft"
            @click="goToDraft"
          >
            Draft
          </el-button>
          <el-button
            :class="['PublishedButton', {'Active': published}]"
            :disabled="published"
            @click="goToPublished"
          >
            Published
          </el-button>
        </el-button-group>
      </div>
      <div class="Stepper">
        <ul>
          <li :class="{active: active === 'general'}">
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
          <li :class="{active: active === 'implementation'}">
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
          <li :class="{active: active === 'technology'}">
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
          <li :class="{active: active === 'interoperability'}">
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
          <li :class="{active: active === 'country'}">
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
          <li :class="{active: active === 'donor'}">
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

      <div
        v-if="!readonly"
        class="NavigationActions"
      >
        <el-button
          v-if="draft"
          type="primary"
          size="medium"
          @click="$emit('publishProject')"
        >
          Publish
        </el-button>

        <el-button
          v-if="newProject || draft"
          :type="newProject ? 'primary' : 'text'"
          :size="newProject ? 'medium' : ''"
          :class="['SaveDraft', {'NewProject': newProject, 'Draft':draft }]"
          @click="$emit('saveDraft')"
        >
          Save draft
        </el-button>

        <el-button
          v-if="draft"
          type="text"
          class="DiscardDraft"
          @click="$emit('discardDraft')"
        >
          Discard draft
        </el-button>

        <el-button
          v-if="published"
          type="text"
          class="GoToDashboard"
        >
          Go to Dashboard
        </el-button>

        <el-button
          v-if="newProject"
          type="text"
          class="CancelButton"
        >
          Cancel
          <span class="ButtonHint">Go back to Dashboard</span>
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
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    newProject: {
      type: Boolean,
      default: false
    },
    draft: {
      type: Boolean,
      default: false
    },
    published: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    active () {
      const hash = this.$route.hash;
      return hash ? hash.replace('#', '') : 'general';
    }
  },
  methods: {
    scrollTo (where) {
      window.location.hash = '';
      this.$nextTick(() => {
        this.$router.replace(`#${where}`);
      });
    },
    goToDraft () {
      const localised = this.localePath({name: 'index-projects-id-edit', params: {...this.$route.params}});
      this.$router.push(localised);
    },
    goToPublished () {
      const localised = this.localePath({name: 'index-projects-id-published', params: {...this.$route.params}});
      this.$router.push(localised);
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
      top: 20px;
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

      .el-button--text {
        width: 100%;
      }

      .CancelButton {
        margin: 0;
      }

    }
  }
</style>
