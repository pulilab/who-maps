<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    class="TableTopActions">
    <el-col class="TableExportOptions">
      <el-row type="flex">
        <el-button
          type="primary"
          size="small"
          class="IconLeft">
          <fa icon="download"/>
          <span v-show="selectedRows.length === 0">
            Export selected
          </span>
          <span v-show="selectedRows.length > 0">
            Export {{ selectedRows.length }} project(s)
          </span>
        </el-button>
        <el-select
          v-model="exportType"
          size="small">
          <el-option
            label="CSV"
            value="CSV"/>
          <el-option
            label="PDF"
            value="PDF"/>
        </el-select>
        <template v-if="selectedRows.length > 0">
          <div class="Separator" />
          <el-button
            type="text"
            size="small"
            class="PrimaryButton"
            @click="selectAll">Select All 450 rows</el-button>
        </template>
      </el-row>
    </el-col>

    <el-col class="TableLegend">
      <el-row
        type="flex"
        align="middle">
        <project-legend
          force-star
          force-eye
          show-label
        />

        <div class="Separator" />

        <el-popover
          v-model="columnSelectorOpen"
          :title="settingsTitle"
          placement="bottom-end"
          width="220"
          trigger="click"
          popper-class="CustomPopover TableSettingsDropdown"
          @show="popperOpenHandler"
        >
          <el-button
            slot="reference"
            type="text"
            size="small"
            class="TableSettingsButton IconLeft"
          >
            <fa icon="cog" />
            Settings
          </el-button>

          <div class="CustomPopoverList Small ColumnSelector">
            <ul class="ColumnList">
              <li
                v-for="c in selectedColumns"
                :key="c.id"
                :class="['Item', {'Selected': c.selected}]"
                @click="c.selected = !c.selected"
              >
                <fa icon="check" />
                {{ c.label }}
              </li>
            </ul>
            <div class="CustomPopoverActions">
              <el-row
                type="flex"
                align="middle">
                <el-col>
                  <el-button
                    type="text"
                    size="small"
                    class="CancelButton"
                    @click="columnSelectorOpen = false">Cancel</el-button>
                </el-col>
                <el-col>
                  <el-button
                    type="text"
                    size="small"
                    class="PrimaryButton"
                    @click="updateColumns">Update</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-popover>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import ProjectLegend from '../common/ProjectLegend';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ProjectLegend
  },
  data () {
    return {
      exportType: 'CSV',
      columnSelectorOpen: false,
      selectedColumns: []
    };
  },
  computed: {
    ...mapGetters({
      columns: 'dashboard/getAvailableColumns',
      selected: 'dashboard/getSelectedColumns',
      selectedRows: 'dashboard/getSelectedRows'
    }),
    settingsTitle () {
      return `main fields (${this.selected.length}/${this.columns.length})`;
    }
  },
  methods: {
    ...mapActions({
      setSelectedColumns: 'dashboard/setSelectedColumns',
      setSelectAll: 'dashboard/setSelectAll'
    }),
    popperOpenHandler () {
      this.selectedColumns = [...this.columns.map(s => ({...s}))];
    },
    updateColumns () {
      this.setSelectedColumns(this.selectedColumns.filter(s => s.selected).map(s => s.id));
      this.columnSelectorOpen = false;
    },
    selectAll () {
      this.setSelectAll(true);
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .TableTopActions {
    width: calc(100vw - @advancedSearchWidth);
    min-width: @appWidthMinLimit - @advancedSearchWidth;
    max-width: @appWidthMaxLimit - @advancedSearchWidth;
    height: @tableTopActionsHeight;
    padding: 0 40px;

    .Separator {
      .SeparatorStyle();
      height: 32px;
      margin: 0 20px;
    }

    .TableExportOptions {
      width: 100%;

      .el-button {
        margin-right: 10px;
      }

      .el-select {
        width: 100px;
      }
    }

    .TableLegend {
      width: auto;
      height: 32px;

      .ProjectLegend {
        font-size: @fontSizeSmall;
        color: @colorTextSecondary;
        white-space: nowrap;

        .svg-inline--fa {
          margin-left: 20px;
          color: @colorTextSecondary;
        }
      }

      .TableSettingsButton {}
    }
  }

  .TableSettingsDropdown {}
</style>
