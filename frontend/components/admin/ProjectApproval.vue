<template>
  <div class="ProjectApproval">
    <el-button @click="csvExport">Export</el-button>
    <el-table
      :data="list"
      border
      style="width: 100%"
    >
      <el-table-column
        :label="$gettext('Project')"
        sortable
        prop="project_name"
      />
      <el-table-column
        :label="$gettext('User')"
        sortable
        prop="user"
      >
        <template slot-scope="scope">
          <user-item
            :id="getUserId(scope.row)"
            show-organisation
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="$gettext('Approved')"
        :filter-method="filterHandler"
        :filters="approvalFilters"
        sortable
        align="center"
        width="150px"
        prop="approved"
      >
        <template slot-scope="scope">
          <approval-tag :value="scope.row.approved" />
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="openDetails(scope.row.id)"
          >
            Details
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Papa from 'papaparse';
import { mapGetters, mapActions } from 'vuex';
import ApprovalTag from './ApprovalTag';
import UserItem from '../common/UserItem';

export default {
  components: {
    ApprovalTag,
    UserItem
  },
  computed: {
    ...mapGetters({
      list: 'admin/approval/getList',
      getUserDetails: 'system/getUserProfileDetails'
    }),
    approvalFilters () {
      return [
        { text: this.$gettext('Yes'), value: true },
        { text: this.$gettext('No'), value: false },
        { text: this.$gettext('Pending'), value: null }
      ];
    },
    parsedList () {
      return this.list.map(i => {
        const user = this.getUserDetails(this.getUserId(i));
        const approved = i.approved === true ? this.$gettext('Yes') : i.approved === false ? this.$gettext('No') : this.$gettext('Pending');
        return {
          project: i.project_name,
          user: user ? user.name : '',
          approved,
          modified: i.modified
        };
      });
    }
  },
  methods: {
    ...mapActions({
      openDetails: 'admin/approval/setCurrentElement'
    }),
    getUserId (row) {
      const history = row.history;
      if (history && history.length > 0) {
        const first = history[0];
        if (first && first.history_user__userprofile) {
          return first.history_user__userprofile;
        }
        return row.legacy_approved_by;
      }
    },
    filterHandler (value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    csvExport () {
      const csv = Papa.unparse(this.parsedList);
      const toDownload = `data:text/csv;charset=utf-8,${csv}`;
      const data = encodeURI(toDownload);
      let link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', 'project-approval-export.csv');
      link.click();
      link = null;
    }
  }
};
</script>

<style lang="less">

.ProjectApproval {
}

</style>
