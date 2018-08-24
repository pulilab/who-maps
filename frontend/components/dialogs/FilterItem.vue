<template>
  <!-- TODO -->
  <!-- Pls add '.Active' class to selected menu -->
  <div
    class="FilterNavItem"
    @click="setActiveItem">
    <el-row
      type="flex"
      align="middle">
      <el-col :span="22">
        <div class="Header">
          {{ header }}
        </div>
        <div class="Bottom">
          <!-- TODO -->
          <!-- This is not working... -->
          <span v-show="!selected">
            Show all
          </span>
          <template v-if="selected">
            <!-- TODO -->
            <!-- Only show button when at least one item is selected -->
            <span class="Filtered">
              {{ selected.length }} item(s) selected
            </span>
            <el-button
              type="text"
              size="small"
              class="DeleteButton"
              @click="$emit('clear')"
            >
              Clear
            </el-button>
          </template>
        </div>
      </el-col>
      <el-col :span="2">
        <fa icon="chevron-right" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: {
    header: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: null
    },
    item: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions({
      setDashboardFiltersDialogState: 'layout/setDashboardFiltersDialogState'
    }),
    setActiveItem () {
      this.setDashboardFiltersDialogState(this.item);
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .FilterNavItem {
    display: block;
    padding: 20px;
    border-bottom: 1px solid @colorGrayLight;
    cursor: pointer;
    transition: @transitionAll;

    &:hover {
      background-color: @colorGrayLightest;

      .Header {
        color: @colorTextPrimary;
      }

      .svg-inline--fa {
        opacity: .5;
      }
    }

    &.Active {
      background-color: mix(@colorWhite, @colorBrandPrimary, 90%);
      border-color: mix(@colorWhite, @colorBrandPrimary, 70%);

      .Header {
        font-weight: 700;
        color: @colorBrandPrimary;
      }

      .svg-inline--fa {
        color: @colorBrandPrimary;
        opacity: 1;
      }
    }

    .el-row {
      .el-col {
        &:first-child {}

        &:last-child {
          text-align: right;
        }
      }
    }

    .Header {
      font-size: @fontSizeMedium;
      color: @colorTextSecondary;
      transition: @transitionAll;
    }

    .Bottom {
      margin-top: 8px;
      font-size: @fontSizeSmall;
      line-height: 20px;
      color: @colorTextMuted;

      .Filtered {
        color: @colorTextSecondary;
      }

      .el-button {
        margin-left: 10px;
        padding: 0;
      }
    }

    .svg-inline--fa {
      opacity: 0;
      transition: @transitionAll;
    }
  }

</style>
