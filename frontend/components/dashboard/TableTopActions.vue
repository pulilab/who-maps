<template>
  <div class="TableTopActions">
    <el-row type="flex">
      <el-col :span="8">
        <el-row type="flex">
          <el-button>
            <fa icon="download"/>
            Export selected
          </el-button>
          <el-select v-model="exportType">
            <el-option
              label="CSV"
              value="CSV"/>
            <el-option
              label="PDF"
              value="PDF"/>
          </el-select>
        </el-row>
      </el-col>
      <el-col :span="16">
        <el-row type="flex">
          <project-legend
            force-star
            force-eye
            show-label
          />
          <div class="separator" />
          <el-popover
            v-model="columnSelectorOpen"
            :title="settingsTitle"
            placement="bottom"
            width="200"
            trigger="click"
            popper-class="ColumnSelectorPoppper"
            @show="popperOpenHandler"
          >
            <el-button
              slot="reference"
              type="text"
            >
              <fa icon="cog" />
              Settings
            </el-button>

            <div class="ColumnSelector">
              <div class="ColumnList">
                <div
                  v-for="c in selectedColumns"
                  :key="c.id"
                  :class="['Item', {'Selected': c.selected}]"
                  @click="c.selected = !c.selected"
                >
                  <fa icon="check" />
                  {{ c.label }}
                </div>
              </div>
              <div class="ColumnSelectorActions">
                <el-button @click="columnSelectorOpen = false">Cancel</el-button>
                <el-button @click="updateColumns">Update</el-button>
              </div>
            </div>
          </el-popover>
        </el-row>
      </el-col>
    </el-row>
  </div>
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
      selected: 'dashboard/getSelectedColumns'
    }),
    settingsTitle () {
      return `main fields (${this.selected.length}/${this.columns.length})`;
    }
  },
  methods: {
    ...mapActions({
      setSelectedColumns: 'dashboard/setSelectedColumns'
    }),
    popperOpenHandler () {
      this.selectedColumns = [...this.columns.map(s => ({...s}))];
    },
    updateColumns () {
      this.setSelectedColumns(this.selectedColumns.filter(s => s.selected).map(s => s.id));
      this.columnSelectorOpen = false;
    }
  }
};
</script>

<style lang="less">
  .ColumnSelectorPoppper {
    .Item {
      svg {
        display: None;
      }
      &.Selected {
        svg {
          display: inline
        }
      }
    }
  }
</style>
