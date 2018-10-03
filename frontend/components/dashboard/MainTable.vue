<template>
  <div class="MainTable">
    <el-table
      ref="mainTable"
      :data="projectsList"
      :max-height="tableMaxHeight"
      :row-class-name="rowClassCalculator"
      :stripe="false"
      :border="true"
      size="mini"
      style="width: 100%"
      @select="selectHandler"
      @select-all="selectHandler"
      @sort-change="sortChanged"
    >
      <el-table-column
        type="selection"
        align="center"
        width="35"
      />
      <el-table-column
        v-if="selectedColumns.includes('1')"
        :label="$gettext('Project Name')"
        fixed
        sortable="custom"
        prop="project__name"
        width="240">
        <template slot-scope="scope">
          <project-card
            :project="scope.row"
            hide-borders
            show-verified
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedColumns.includes('2')"
        :label="$gettext('Country')"
        sortable="custom"
        prop="country__name"
        width="180">
        <template slot-scope="scope">
          <country-item
            :id="scope.row.country"
            :show-flag="false"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedColumns.includes('3')"
        :label="$gettext('Organisation Name')"
        sortable="custom"
        prop="organisation__name"
        width="240">
        <template slot-scope="scope">
          <organisation-item
            :id="scope.row.organisation"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedColumns.includes('4')"
        :label="$gettext('Government Investor')"
        sortable="custom"
        prop="project__data__government_investor"
        width="180">
        <template slot-scope="scope">
          <span v-show="scope.row.government_investor"><translate>Yes</translate></span>
          <span v-show="!scope.row.government_investor"><translate>No</translate></span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedColumns.includes('5')"
        :label="$gettext('Region')"
        sortable="custom"
        prop="country__region"
        width="180">
        <template slot-scope="scope">
          <region-item
            :id="scope.row.region"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedColumns.includes('6')"
        :label="$gettext('Donors')"
        width="240">
        <template slot-scope="scope">
          <donors-list
            :value="scope.row.donors"
            :limit="3"
            show-icon />
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedColumns.includes('7')"
        :label="$gettext('Contact Name')"
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
        v-if="selectedColumns.includes('8')"
        :label="$gettext('Implementation Overview')"
        width="240">
        <template slot-scope="scope">
          <p>{{ scope.row.implementation_overview }}</p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedColumns.includes('9')"
        :label="$gettext('Geographic Scope')"
        width="240">
        <template slot-scope="scope">
          <p>{{ scope.row.geographic_scope }}</p>
        </template>
      </el-table-column>

      <el-table-column
        v-for="col in countryColumns"
        :key="col.id"
        :label="col.label"
        width="240">
        <template slot-scope="scope">
          <custom-answers-cell
            :row="scope.row"
            :id="col.originalId"
            :type="col.type"
            module="country"
          />
        </template>
      </el-table-column>

      <el-table-column
        v-for="col in donorColumns"
        :key="col.id"
        :label="col.label"
        width="240">
        <template slot-scope="scope">
          <custom-answers-cell
            :row="scope.row"
            :id="col.originalId"
            :type="col.type"
            :donor-id="col.donorId"
          />
        </template>
      </el-table-column>

    </el-table>

    <div class="Pagination">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :page-sizes="pageSizeOption"
        :total="total"
        layout="sizes, prev, slot, next"
      >
        <span class="PageCounter">
          <translate :parameters="{min, max, total}">{min}-{max} of {total}</translate>
        </span>
      </el-pagination>
    </div>
  </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { mapGettersActions } from '../../utilities/form.js';

import ProjectCard from '../common/ProjectCard';
import CountryItem from '../common/CountryItem';
import OrganisationItem from '../common/OrganisationItem';
import HealthFocusAreasList from '../common/list/HealthFocusAreasList';
import DonorsList from '../common/list/DonorsList';
import RegionItem from '../common/RegionItem';
import CustomAnswersCell from './CustomAnswersCell';

export default {
  components: {
    ProjectCard,
    CountryItem,
    OrganisationItem,
    HealthFocusAreasList,
    DonorsList,
    RegionItem,
    CustomAnswersCell
  },
  data () {
    return {
      pageSizeOption: [10, 20, 50, 100],
      tableMaxHeight: 200,
      localSort: null
    };
  },
  computed: {
    ...mapGetters({
      projectsList: 'dashboard/getProjectsList',
      selectedColumns: 'dashboard/getSelectedColumns',
      selectedRows: 'dashboard/getSelectedRows',
      selectAll: 'dashboard/getSelectAll',
      total: 'dashboard/getTotal',
      countryColumns: 'dashboard/getCountryColumns',
      donorColumns: 'dashboard/getDonorColumns'
    }),
    ...mapGettersActions({
      pageSize: ['dashboard', 'getPageSize', 'setPageSize', 0],
      currentPage: ['dashboard', 'getCurrentPage', 'setCurrentPage', 0],
      sorting: ['dashboard', 'getSorting', 'setSorting', 0]
    }),
    min () {
      return 1 + this.pageSize * (this.currentPage - 1);
    },
    max () {
      const max = this.pageSize * this.currentPage;
      return max < this.total ? max : this.total;
    }
  },
  watch: {
    selectAll: {
      immediate: true,
      handler (value) {
        if (this.$refs.mainTable) {
          this.$refs.mainTable.clearSelection();
          if (value) {
            this.$refs.mainTable.toggleAllSelection();
          }
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
    },
    sorting: {
      immediate: false,
      handler (current) {
        if (current !== this.localSort) {
          this.fixSorting(current);
        }
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.fixTableHeight();
      this.fixSorting(this.$route.query.ordering);
      if (this.selectAll) {
        this.$refs.mainTable.clearSelection();
        this.$refs.mainTable.toggleAllSelection();
      }
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
      return this.selectedRows.includes('row'.id) ? 'Selected' : 'NotSelected';
    },
    sortChanged ({prop, order}) {
      if (order === 'descending') {
        this.sorting = '-' + prop;
        this.localSort = '-' + prop;
      } else {
        this.sorting = prop;
        this.localSort = prop;
      }
    },
    fixTableHeight () {
      const maxHeight = window.getComputedStyle(this.$el).getPropertyValue('max-height');
      this.tableMaxHeight = +maxHeight.replace('px', '');
      this.$refs.mainTable.doLayout();
    },
    fixSorting (prop) {
      if (prop) {
        let direction = 'ascending';
        if (prop.startsWith('-')) {
          direction = 'descending';
          prop = prop.replace('-', '');
        }
        this.$refs.mainTable.sort(prop, direction);
      }
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

        // Disable select-all-row
        &.el-table-column--selection {
          .el-checkbox {
            display: none;
          }
        }
      }

      td {
        > .cell {
          line-height: 17px;
          word-break: normal;

          p {
            position: relative;
            margin: 0;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            // With 17 in the calc the fixed columns and the rest of the table go out of sync
            max-height: calc(16.5px * 4);

            // &::after {
            //   content: "";
            //   text-align: right;
            //   position: absolute;
            //   bottom: 0;
            //   right: 0;
            //   width: 20%;
            //   height: 17px;
            //   background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
            // }

          }

          a {
            &[rel="email"] {
              display: block;
            }
          }
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
        top: 1px;
        right: 4px;
      }

      .el-table__empty-block {
        position: relative;
      }

      .el-table__empty-text {
        position: absolute;
        top: 24px;
        left: 20px;
        width: auto;
      }

      .ProjectCard {
        overflow: visible;

        .ProjectName {
          padding-right: 12px;
        }

        .ProjectCountryOrg {
          margin-top: 4px;
        }

        .ProjectLegend {
          top: -1px;
          right: 0;
          opacity: 1 !important;

          .svg-inline--fa {
            position: relative;
            height: 14px;
            font-size: 12px;

            &.fa-star {
              font-size: 11px;
            }

            &.fa-eye,
            &.fa-handshake {
              right: -1px;
            }
          }
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

      .DonorList {
        ul {
          padding: 0;
          margin: 0;
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
