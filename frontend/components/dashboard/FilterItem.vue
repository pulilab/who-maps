<template>
  <div class="FilterItem">
    <el-row
      type="flex"
      class="FilterItemHeader">
      <el-col class="Label">
        {{ label }}
      </el-col>
      <el-col class="Setup">
        <el-button
          type="text"
          size="small"
          class="IconLeft">
          <span v-show="!selected">
            <fa icon="plus" />
            Add
          </span>
          <span v-show="selected">
            <fa icon="pencil-alt" />
            Edit
          </span>
        </el-button>
      </el-col>
    </el-row>

    <div class="FilterItemSelected">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .FilterItem {
    .FilterItemHeader {
      padding: 0 0 5px;

      .Label {
        width: 100%;
        font-size: @fontSizeBase;
        color: @colorTextPrimary;
      }

      .Setup {
        width: auto;
        padding-left: 10px;

        .el-button {
          padding: 0;
        }
      }
    }

    .FilterItemSelected {
      ul {
        list-style-type: none;
        margin: 2px 0 15px;
        padding: 0;
        font-size: @fontSizeSmall;

        li {
          position: relative;
          max-width: 80%;
          margin: 0;
          padding: 0 10px 0 28px;
          line-height: 20px;
          .textTruncate();

          .ListActionButton {
            position: absolute;
            top: 2px;
            left: 8px;
            padding: 0;
            width: 16px;
            height: 16px;

            .svg-inline--fa {
              width: 10px;

              &.fa-check {
                color: @colorGray;
              }
              &.fa-times {
                color: @colorDanger;
              }
            }

            + span {
              color: @colorTextSecondary;
            }
          }
        }
      }
    }
  }
</style>
