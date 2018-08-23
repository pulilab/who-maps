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
          class="IconLeft"
          @click="openDialog"
        >
          <span v-show="!isSelected">
            <fa icon="plus" />
            Add
          </span>
          <span v-show="isSelected">
            <fa icon="pencil-alt" />
            Edit
          </span>
        </el-button>
      </el-col>
    </el-row>

    <div class="FilterItemSelected">
      <slot/>
    </div>
    <div
      v-show="showLimit"
      class="ShowMore"
    >
      <el-button
        type="text"
        @click="openDialog"
      >
        Show all selected
      </el-button>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    selected: {
      type: Array,
      default: () => []
    },
    item: {
      type: String,
      required: true
    },
    limit: {
      type: Number,
      default: null
    }
  },
  computed: {
    isSelected () {
      return this.selected.length > 0;
    },
    showLimit () {
      return this.limit ? this.selected.length > this.limit : false;
    }
  },
  methods: {
    ...mapActions({
      setDashboardFiltersDialogState: 'layout/setDashboardFiltersDialogState'
    }),
    openDialog () {
      this.setDashboardFiltersDialogState(this.item);
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
          padding: 0 10px 0 22px;
          line-height: 20px;
          .textTruncate();

          .ListActionButton {
            position: absolute;
            top: 2px;
            left: 2px;
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
