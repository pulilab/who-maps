<template>
  <el-dialog
    :visible.sync="visible"
    :title="$gettext('Proejct Approval')"
    modal
    top="10vh"
    width="80vw"
    custom-class="ProjectApprovalDialog"
    @open="loadCurrent"
  >

    <el-tabs v-model="activeTab">
      <el-tab-pane
        :label="$gettext('Update')"
        name="form"
      >
        <el-form
          ref="approvalForm"
          :model="form"
          :rules="rules"
          label-position="left"
          label-width="160px"
          @submit.native.prevent
        >
          <el-form-item
            :label="$gettext('Approved')"
            prop="approved">
            <el-select
              v-model="form.approved"
              placeholder="Select">
              <el-option
                :value="true"
                label="Yes"
              />
              <el-option
                :value="false"
                label="No"
              />
              <el-option
                :value="null"
                label="Pending"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$gettext('Reason')"
            prop="reason">
            <el-input
              v-model="form.reason"
              :rows="3"
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        :label="$gettext('History')"
        name="history"
      >
        <el-table
          :data="history"
          border
          style="width: 100%"
        >
          <el-table-column
            :label="$gettext('Date/Time')"
            :formatter="dateFormat"
            prop="modified"
          />
          <el-table-column
            :label="$gettext('User')"
            prop="history_user__userprofile"
          >
            <template slot-scope="scope">
              <user-item
                :id="scope.row.history_user__userprofile"
                show-organisation
              />
            </template>
          </el-table-column>
          <el-table-column
            :label="$gettext('Reason')"
            prop="reason"
          />
          <el-table-column
            :label="$gettext('Approved')"
            align="center"
            width="150px"
            prop="approved"
          >
            <template slot-scope="scope">
              <approval-tag :value="scope.row.approved" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

    </el-tabs>

    <span slot="footer">
      <el-row
        v-show="activeTab === 'form'"
        type="flex"
        align="center">
        <el-col class="SecondaryButtons">
          <el-button
            type="text"
            class="CancelButton"
            @click="cancel">
            <translate>Cancel</translate>
          </el-button>
        </el-col>
        <el-col class="PrimaryButtons">
          <el-button
            type="primary"
            @click="apply"
          >
            <translate>Save</translate>
          </el-button>
        </el-col>
      </el-row>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { format } from 'date-fns';

import ApprovalTag from '../admin/ApprovalTag';
import UserItem from '../common/UserItem';

export default {
  components: {
    ApprovalTag,
    UserItem
  },
  data () {
    return {
      form: {
        approved: null,
        reason: null
      },
      activeTab: 'form',
      rules: {
        reason: [
          { required: true, message: this.$gettext('This is required'), trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      currentProject: 'admin/approval/getCurrentElement',
      currentElementDetails: 'admin/approval/getCurrentElementDetails'
    }),
    visible: {
      get () {
        return this.currentProject !== null;
      },
      set () {
        this.setCurrentElement(null);
      }
    },
    history () {
      if (this.currentElementDetails) {
        return this.currentElementDetails.history;
      }
      return [];
    }
  },
  methods: {
    ...mapActions({
      setCurrentElement: 'admin/approval/setCurrentElement',
      updateProjectApproval: 'admin/approval/updateProjectApproval'
    }),
    loadCurrent () {
      this.form = {
        approved: this.currentElementDetails ? this.currentElementDetails.approved : null,
        reason: this.currentElementDetails ? this.currentElementDetails.reason : ''
      };
    },
    dateFormat (row, column, value) {
      return format(value, 'YYYY-MM-DD HH:mm');
    },
    cancel () {
      this.setCurrentElement(null);
    },
    apply () {
      this.$refs.approvalForm.validate(async valid => {
        if (valid) {
          try {
            await this.updateProjectApproval(this.form);
            this.setCurrentElement(null);
          } catch (e) {
            console.log(e);
            this.$alert(
              this.$gettext('An error occured while saving the data'),
              this.$gettext('Warning'),
              {
                confirmButtonText: this.$gettext('Ok')
              }
            );
          }
        } else {
          this.$message.error(this.$gettext('Please fill all the required fields'));
        }
      });
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .ProjectApprovalDialog {
    .el-form,
    .el-form-item {
      margin: 20px 0;
    }
  }
</style>
