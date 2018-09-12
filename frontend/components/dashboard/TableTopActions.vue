<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    class="TableTopActions">
    <el-col class="TableExportOptions">
      <el-row type="flex">
        <el-button
          :disabled="selectedRows.length === 0"
          type="primary"
          size="small"
          class="IconLeft"
          @click="exportRows"
        >
          <fa icon="download"/>
          <span v-show="selectedRows.length === 0">
            <translate>Export selected</translate>
          </span>
          <span v-show="selected">
            <translate :parameters="{selected}">Export {selected} project(s)</translate>
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
            :disabled="allSelected"
            type="text"
            size="small"
            class="PrimaryButton"
            @click="selectAll"><translate>Select All {{ total }} rows</translate></el-button>
        </template>

        <div class="Separator" />
        <el-button
          :disabled="selectedRows.length === 0"
          type="primary"
          size="small"
          class="IconLeft"
          @click="openMailDialog"
        >
          <fa icon="envelope"/>
          <translate v-show="selected === 0">Contact Selected</translate>
          <translate
            v-show="selected > 0"
            :parameters="{selected}">
            Contact {selected} project(s)
          </translate>
        </el-button>
        <pdf-export ref="pdfExport" />
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
            <translate>Settings</translate>
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
                    @click="columnSelectorOpen = false"><translate>Cancel</translate></el-button>
                </el-col>
                <el-col>
                  <el-button
                    type="text"
                    size="small"
                    class="PrimaryButton"
                    @click="updateColumns"><translate>Update</translate></el-button>
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
import PdfExport from './PdfExport';

import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ProjectLegend,
    PdfExport
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
      selectedRows: 'dashboard/getSelectedRows',
      allSelected: 'dashboard/getSelectAll',
      total: 'dashboard/getTotal'
    }),
    settingsTitle () {
      return `${this.$gettext('main fields')} (${this.selected.length}/${this.columns.length})`;
    },
    selected () {
      return this.allSelected ? this.total : this.selectedRows.length;
    }
  },
  methods: {
    ...mapActions({
      setSelectedColumns: 'dashboard/setSelectedColumns',
      setSelectAll: 'dashboard/setSelectAll',
      setSendEmailDialogState: 'layout/setSendEmailDialogState',
      loadProjectsBucket: 'dashboard/loadProjectsBucket'
    }),
    popperOpenHandler () {
      this.selectedColumns = [...this.columns.map(s => ({...s}))];
    },
    updateColumns () {
      this.setSelectedColumns(this.selectedColumns.filter(s => s.selected).map(s => s.id));
      this.columnSelectorOpen = false;
    },
    async selectAll () {
      await this.loadProjectsBucket();
      this.setSelectAll(true);
    },
    exportRows () {
      if (this.exportType === 'PDF') {
        this.$refs.pdfExport.printPdf();
      }
    },
    async openMailDialog () {
      if (this.allSelected) {
        await this.loadProjectsBucket();
      }
      this.setSendEmailDialogState(true);
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

  .TableSettingsDropdown {
    transform: translate(10px, -30px);
  }
</style>
