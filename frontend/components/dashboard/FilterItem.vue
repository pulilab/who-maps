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
  }

</style>
