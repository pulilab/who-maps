<template>
  <div
    v-scroll-class:FixedNavigation="340"
    class="ProjectNavigation"
  >
    <el-card :body-style="{ padding: '0px' }">
      <div
        v-if="!readonly && !newProject"
        class="SwitchProjectStatus"
      >
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
        >
          <div class="SwitchLabel">Switch view:</div>
          <el-button-group class="SwitchButtons">
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
        </el-row>
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
              Country fields
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
              Donor fields
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
          :disabled="!!loading"
          type="primary"
          size="medium"
          @click="$emit('publishProject')"
        >
          <fa
            v-show="loading === 'publish'"
            icon="spinner"
            spin />
          Publish
        </el-button>

        <el-button
          v-if="newProject || draft"
          :type="newProject ? 'primary' : 'text'"
          :size="newProject ? 'medium' : ''"
          :class="['SaveDraft', {'NewProject': newProject, 'Draft':draft }]"
          :disabled="!!loading"
          @click="$emit('saveDraft')"
        >
          <fa
            v-show="loading === 'draft'"
            icon="spinner"
            spin />
          Save draft
        </el-button>

        <el-button
          v-if="draft"
          :disabled="!!loading"
          type="text"
          class="DiscardDraft DeleteButton"
          @click="$emit('discardDraft')"
        >
          <fa
            v-show="loading === 'discard'"
            icon="spinner"
            spin />
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
import { mapGetters } from 'vuex';

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
    ...mapGetters({
      loading: 'project/getLoading'
    }),
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
      const localised = this.localePath({name: 'organisation-projects-id-edit', params: {...this.$route.params}});
      this.$router.push(localised);
    },
    goToPublished () {
      const localised = this.localePath({name: 'organisation-projects-id-published', params: {...this.$route.params}});
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

    .SwitchProjectStatus {
      height: 58px;
      padding: 0 14px;
      border-bottom: 1px solid @colorGrayLight;
      box-sizing: border-box;

      .el-row {
        height: 100%;
      }

      .SwitchLabel {
        padding-right: 12px;
        font-size: @fontSizeBase;
        color: @colorTextPrimary;
      }

      .SwitchButtons {
        .el-button {
          margin: 0 !important;
          padding: 0 10px;
          height: 29px;
          line-height: 29px;
          border: 0 !important;
          background-color: @colorGrayLighter;
          color: @colorTextSecondary;
          font-size: @fontSizeSmall + 1;
          text-transform: uppercase;

          &:not(.Active) {
            &:hover {
              background-color: darken(@colorGrayLighter, 5%);
              color: @colorTextPrimary;
            }
          }
        }

        .DraftButton {
          &.Active {
            color: @colorTextPrimary;
            background-color: @colorDraft;
          }
        }

        .PublishedButton {
          &.Active {
            color: @colorWhite;
            background-color: @colorPublished;
          }
        }
      }
    }

    .Stepper {
      ul {
        position: relative;
        list-style: none;
        margin: 20px 0 25px;
        padding: 0;

        @media only screen and (max-height: 1024px) {
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
              border-width: 4px;
              color: @colorWhite;
              transform: scale(1.2);
            }

            .svg-inline--fa {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }
        }

        &.active {
          .el-button {
            font-weight: 700;
          }
        }
      }

      .el-button {
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

        @media only screen and (max-height: 1024px) {
          height: 48px;
          line-height: 48px;
        }

        .Step {
          position: absolute;
          top: 15px;
          left: 30px;
          overflow: hidden;
          box-sizing: border-box;
          display: inline-block;
          width: 30px;
          height: 30px;
          border: 6px solid @colorWhite;
          background-color: @colorGrayLight;
          border-radius: 30px;
          color: @colorGrayLight;
          transition: all 200ms ease;

          @media only screen and (max-height: 1024px) {
            top: 8px;
          }

          .svg-inline--fa {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-100%, -50%);
            display: inline-block;
            width: 12px;
            height: 12px;
            opacity: 0;
            transition: @transitionFadeMd;
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
        margin: 0;
        font-size: @fontSizeMedium;
      }

      .fa-spin {
        margin-right: 2px;
      }
    }
  }
</style>
