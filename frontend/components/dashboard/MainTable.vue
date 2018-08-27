<template>
  <div class="MainTable">
    <el-table
      :data="projects"
      :max-height="tableMaxHeight"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        width="55"
        fixed
      />
      <el-table-column
        sortable
        fixed
        label="Project Name"
        width="180">
        <template slot-scope="scope">
          <project-card
            :id="scope.row.id"
            hide-borders
            show-verified
          />
        </template>
      </el-table-column>
      <el-table-column
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
        sortable
        label="Organisation Name"
        width="180">
        <template slot-scope="scope">
          <organisation-item
            :id="scope.row.organisation"
          />
        </template>
      </el-table-column>
      <el-table-column
        sortable
        label="Donors"
        width="180">
        <template slot-scope="scope">
          <span
            v-for="(donor, index) in scope.row.donors"
            :key="index"
          >
            {{ donor }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        label="Contact Name"
        width="180">
        <template slot-scope="scope">
          <span> {{ scope.row.contact_name }}</span>
          <a :href="`mailto:${scope.row.contact_email}`"> {{ scope.row.contact_email }}</a>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        label="Implementation Overview"
        width="180">
        <template slot-scope="scope">
          <p> {{ scope.row.implementation_overview }}</p>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        label="Geographic Scope"
        width="180">
        <template slot-scope="scope">
          <p> {{ scope.row.geographic_scope }}</p>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        label="Health Focus Areas"
        width="180">
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
        <span class="Counter">
          {{ min }}-{{ max }} of {{ total }}
        </span>
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
      pageSizeOption: [10, 20, 50, 100]
    };
  },
  computed: {
    ...mapGetters({
      projects: 'dashboard/getProjects'
    }),
    tableMaxHeight () {
      // TODO fix this to work on resizes
      if (this.$el) {
        return window.getComputedStyle(this.$el).getPropertyValue('max-height');
      }
      return '500';
    },
    min () {
      return 1 + this.pageSize * (this.currentPage - 1);
    },
    max () {
      return this.pageSize * this.currentPage;
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

  }
</style>
