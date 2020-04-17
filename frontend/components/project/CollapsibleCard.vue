<template>
  <div class="CollapsibleCard">
    <el-card :body-style="{ padding: '0px' }">
      <div
        slot="header"
        class="CollapsibleHeader"
      >
        <span class="CardTitle">
          {{ `${prependFormat}${title}` }}
        </span>
        <el-button
          type="text"
          class="CollapseToggle"
          @click="toggleCard"
        >
          <fa
            v-show="open"
            icon="angle-down"
            size="lg"
          />
          <fa
            v-show="!open"
            icon="angle-up"
            size="lg"
          />
        </el-button>
      </div>

      <transition name="slide-fade">
        <div
          v-show="open"
          class="ContentContainer"
        >
          <div
            v-if="showLegend"
            class="Legend"
          >
            <div>
              <span class="Required Draft" />
              <span class="Text">
                <translate ref="draft_required">
                  Required to save draft
                </translate>
              </span>
            </div>
            <div>
              <span class="Required Publish" />
              <span class="Text">
                <translate ref="publish_required">
                  Required to publish
                </translate>
              </span>
            </div>
          </div>
          <slot />
        </div>
      </transition>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    showLegend: {
      type: Boolean,
      default: false
    },
    prependTitle: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      open: true
    };
  },
  computed: {
    prependFormat () {
      return this.prependTitle ? `${this.prependTitle}. ` : '';
    }
  },
  methods: {
    toggleCard () {
      this.open = !this.open;
    },
    expandCard () {
      this.open = true;
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .CollapsibleCard {
    margin: 0 0 20px;
    .Legend {
      display: flex;
      justify-content: flex-end;
      margin-top: -28px;
      margin-bottom: 16px;
      div {
        margin-left: 12px;
      }

      .Text {
        font-size: @fontSizeSmall
      }

      .Required{
        display: inline-block;
        width: 10px;
        height: 10px;
        font-size: 16px;
        line-height: 12px;
        font-weight: 900;
        text-align: center;
        color: #FFFFFF;
        border-radius: 50%;

        > span {
          position: relative;
          top: 4px;
        }
      }
      .Draft{
        background-color: @colorDraft
      }
      .Publish{
        background-color: @colorPublished
      }
    }

    .el-card {
      .el-card__header {
        padding: 0 20px 0 40px;
        height: 58px;
        line-height: 58px;
        background-color: @colorBrandPrimaryDark;
        font-size: @fontSizeLarger;
      }
    }

    .CollapsibleHeader {
      .clearfix();

      .CardTitle {
        float: left;
      }

      .CollapseToggle {
        width: 58px;
        height: 58px;
        float: right;
        color: @colorWhite;

        .svg-inline--fa {
          width: 12px;
          transform: rotateX(0deg);
          transition: @transitionAll;
        }

        &:hover {
          .svg-inline--fa {
            opacity: .8;
            transform: rotateX(180deg);
          }
        }
      }
    }

    .ContentContainer {
      position: relative;
      // padding: 22px 74px 60px 40px;
      padding: 50px 74px 60px 40px;
    }

    .slide-fade-enter-active {
      transition: @transitionAll;
    }

    .slide-fade-leave-active {
      transition: @transitionAll;
    }

    .slide-fade-enter,
    .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
      transform: translateY(-20px);
      opacity: 0;
    }
  }
</style>
