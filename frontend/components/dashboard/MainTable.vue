<template>
  <div class="MainTable">
    <el-table
      ref="mainTable"
      :data="projects"
      :max-height="tableMaxHeight"
      :row-class-name="rowClassCalculator"
      :stripe="false"
      :border="true"
      size="mini"
      style="width: 100%"
      @select="selectHandler"
      @select-all="selectHandler"
    >
      <el-table-column
        type="selection"
        width="38"
      />
      <el-table-column
        v-if="selectedColumns.includes(1)"
        fixed
        sortable
        label="Project Name"
        width="240">
        <template slot-scope="scope">
          <project-card
            :id="scope.row.id"
            hide-borders
            show-verified
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedColumns.includes(2)"
        sortable
        label="Country"
        width="180">
        <template slot-scope="scope">
          <country-item
            :id="scope.row.country"
            :show-flag="false"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedColumns.includes(3)"
        sortable
        label="Organisation Name"
        width="240">
        <template slot-scope="scope">
          <organisation-item
            :id="scope.row.organisation"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedColumns.includes(4)"
        sortable
        label="Donors"
        width="240">
        <template slot-scope="scope">
          <span
            v-for="(donor, index) in scope.row.donors"
            :key="index"
            class="DonorItem"
          >
            <span>
              <fa
                icon="user-tie"
                size="xs" />
            </span>
            <span>{{ donor }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedColumns.includes(5)"
        sortable
        label="Contact Name"
        width="240">
        <template slot-scope="scope">
          <span>{{ scope.row.contact_name }}</span>
          <a
            :href="`mailto:${scope.row.contact_email}`"
            :rel="`email`"
            class="TextLink">{{ scope.row.contact_email }}</a>
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedColumns.includes(6)"
        sortable
        label="Implementation Overview"
        width="240">
        <template slot-scope="scope">
          <p>{{ scope.row.implementation_overview }}</p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedColumns.includes(7)"
        sortable
        label="Geographic Scope"
        width="240">
        <template slot-scope="scope">
          <p>{{ scope.row.geographic_scope }}</p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedColumns.includes(8)"
        sortable
        label="Health Focus Areas"
        width="240">
        <template slot-scope="scope">
          <health-focus-areas-list :value="scope.row.health_focus_areas" />
        </template>
      </el-table-column>
    </el-table>

    <div class="Pagination">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizeOption"
        :total="total"
        layout="sizes, prev, slot, next"
      >
        <span class="PageCounter">
          {{ min }}-{{ max }} of {{ total }}
        </span>
      </el-pagination>
    </div>
  </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import ProjectCard from '../common/ProjectCard';
import CountryItem from '../common/CountryItem';
import OrganisationItem from '../common/OrganisationItem';
import HealthFocusAreasList from '../common/list/HealthFocusAreasList';

export default {
  components: {
    ProjectCard,
    CountryItem,
    OrganisationItem,
    HealthFocusAreasList
  },
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 450,
      pageSizeOption: [10, 20, 50, 100],
      tableMaxHeight: 200
    };
  },
  computed: {
    ...mapGetters({
      projects: 'dashboard/getProjects',
      selectedColumns: 'dashboard/getSelectedColumns',
      selectedRows: 'dashboard/getSelectedRows',
      selectAll: 'dashboard/getSelectAll'
    }),
    min () {
      return 1 + this.pageSize * (this.currentPage - 1);
    },
    max () {
      return this.pageSize * this.currentPage;
    }
  },
  watch: {
    selectAll: {
      immediate: true,
      handler (value) {
        if (value) {
          this.$refs.mainTable.clearSelection();
          this.$refs.mainTable.toggleAllSelection();
        }
      }
    },
    selectedColumns: {
      immediate: false,
      handler (columns) {
        this.$nextTick(() => {
          this.$refs.mainTable.doLayout();
        });
      }
    }
  },
  mounted () {
    setTimeout(() => {
      const maxHeight = window.getComputedStyle(this.$el).getPropertyValue('max-height');
      this.tableMaxHeight = +maxHeight.replace('px', '');
      this.$refs.mainTable.doLayout();
    }, 500);
  },
  methods: {
    ...mapActions({
      setSelectedRows: 'dashboard/setSelectedRows'
    }),
    selectHandler (selection) {
      this.setSelectedRows(selection.map(s => s.id));
    },
    rowClassCalculator ({row}) {
      return this.selectedRows.includes(row.id) ? 'Selected' : 'NotSelected';
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .MainTable {
    margin: 0 40px;
    max-height: calc(100vh - @topBarHeight - @actionBarHeight - @tableTopActionsHeight - @appFooterHeight - 93px);

    // Custom table template
    .el-table {
      th, td {
        vertical-align: top;
      }

      th {
        > .cell {
          line-height: 24px;
        }

        &.is-leaf {
          border-bottom-color: @colorTextMuted;
        }
      }

      td {
        > .cell {
          p {
            margin: 0 0 10px;
          }

          a {
            &[rel="email"] {
              display: block;
            }
          }
        }
      }

      // select row
      .el-table-column--selection {
        > .cell {
          padding: 0 10px;
          text-align: center;
        }
      }

      // selected table row
      .el-table__row {
        &.Selected {
          > td {
            background-color: #FFFBDC;

            &.el-table-column--selection {
              box-shadow: inset 2px 0 0 #FBC02D;
            }
          }
        }
      }

      .caret-wrapper {
        position: absolute;
        top: -2px;
        right: 2px;
        vertical-align: top;
        height: 30px;

        i {
          border-width: 4px;
        }
      }

      .CountryItem {
        .CountryFlag {
          display: none;
        }

        .CountryName {
          margin: 0;
          font-size: @fontSizeSmall;
          line-height: inherit;
        }
      }

      .DonorItem {
        display: inline-flex;
        align-items: flex-start;
        width: 100%;

        .svg-inline--fa {
          position: relative;
          top: -1px;
          margin-right: 5px;
        }
      }

      .HealthFocusAreasList {
        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;

          li {
            display: inline-flex;
            align-items: flex-start;
            width: 100%;

            .svg-inline--fa {
              position: relative;
              top: -1px;
              display: inline-block;
              margin-right: 5px;
            }
          }
        }
      }
    }

    .Pagination {
      z-index: 5;
      position: relative;
      top: -1px;
      width: 100%;
      // don't forget to calculate this into max-height of MainTable
      height: 53px;
      //
      box-sizing: border-box;
      border: solid @colorGrayLight;
      border-width: 1px 1px 2px;
      background-color: @colorBrandBlueLight;
      text-align: right;

      .el-pagination {
        padding: 11px 20px;
        font-weight: 400;

        .el-pagination__sizes {
          float: left;
          margin: 0;
        }

        .PageCounter {
          display: inline-block;
          margin: 0 10px;
          font-size: @fontSizeSmall;
          color: @colorTextSecondary;
        }

        button {
          padding: 0;
          background-color: transparent;
          transition: @transitionAll;

          &:hover {
            background-color: lighten(@colorBrandBlueLight, 3%);
          }

          i {
            font-size: @fontSizeLarge;
            font-weight: 700;
          }
        }
      }
    }
  }
</style>
