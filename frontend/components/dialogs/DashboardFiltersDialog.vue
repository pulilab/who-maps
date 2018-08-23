<template>
  <el-dialog
    :visible.sync="visible"
    title="Applying specific filter to map/list"
    modal
    top="10vh"
    width="90vw"
    custom-class="FilterDialog"
    @open="loadCurrentSelection"
  >
    <el-row
      type="flex"
      class="HfaMainCategories">
      <el-col :span="6">
        <filter-selector />
      </el-col>
      <el-col :span="18">
        <filter-area ref="filterArea" />
      </el-col>
    </el-row>
    <span slot="footer">
      <el-row
        type="flex"
        align="center">
        <el-col class="SecondaryButtons">
          <el-button
            type="text"
            class="CancelButton"
            @click="cancel">
            Cancel
          </el-button>
          <el-button
            type="text"
            class="DeleteButton"
            @click="clearAll">
            Clear All
          </el-button>
        </el-col>
        <el-col class="PrimaryButtons">
          <el-button
            type="primary"
            @click="apply"
          >
            Apply filters
          </el-button>
        </el-col>
      </el-row>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import FilterSelector from './FilterSelector';
import FilterArea from './FilterArea';

export default {
  components: {
    FilterSelector,
    FilterArea
  },
  computed: {
    ...mapGetters({
      selectedFilter: 'layout/getDashboardFiltersDialogState'
    }),
    visible: {
      get () {
        return this.selectedFilter !== null;
      },
      set () {
        this.setDashboardFiltersDialogState(null);
      }
    }
  },
  methods: {
    ...mapActions({
      setDashboardFiltersDialogState: 'layout/setDashboardFiltersDialogState'
    }),
    loadCurrentSelection () {
    },
    clearAll () {
      this.$refs.filterArea.clearAll();
    },
    cancel () {
      this.setDashboardFiltersDialogState(null);
    },
    apply () {
      this.$refs.filterArea.applyFilters();
      this.$nextTick(() => {
        this.setDashboardFiltersDialogState(null);
      });
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .SelectHfaDialog {
    height: 80vh;
    margin-top: 0;
    margin-bottom: 0;

    .el-dialog__body {
      padding: 0;
      height: calc(80vh - (@dialogHeaderFooterHeight*2));
    }

    .HfaMainCategories {
      height: calc(80vh - (@dialogHeaderFooterHeight*2));

      > .el-col {
        overflow: hidden;
        border-right: 1px solid @colorGrayLight;

        &:last-child {
          .SelectorDialogColumn {
            .Header {
              width: calc(90vw / 4);
            }
          }
        }
      }
    }
  }
</style>
