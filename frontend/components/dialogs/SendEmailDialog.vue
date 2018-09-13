<template>
  <el-dialog
    :visible.sync="visible"
    :title="$gettext('Send email to contact person(s)')"
    modal
    top="10vh"
    width="70vw"
    custom-class="SendEmailDialog"
  >
    <el-form
      @submit.native.prevent>
      <el-form-item :label="$gettext('Email addresses') + ` (${rows})`">
        <el-input
          ref="emailArea"
          :rows="rows < 10 ? rows : 10"
          v-model="selectable"
          readonly
          class="AddressesArea"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-row
        type="flex"
        align="center">
        <el-col class="SecondaryButtons">
          <el-button
            type="text"
            class="CancelButton"
            @click="copy">
            <translate>Copy to clipboard</translate>
          </el-button>
        </el-col>
        <el-col class="PrimaryButtons">
          <el-button
            type="primary"
            @click="send"
          >
            <translate>Send email(s)</translate>
          </el-button>
        </el-col>
      </el-row>
    </span>
  </el-dialog>
</template>

<script>
import { mapGettersActions } from '../../utilities/form.js';
import { mapGetters } from 'vuex';
import uniqBy from 'lodash/uniqBy';

export default {
  computed: {
    ...mapGetters({
      projects: 'dashboard/getProjectsBucket',
      profile: 'user/getProfile',
      selectAll: 'dashboard/getSelectAll',
      selectedRows: 'dashboard/getSelectedRows'
    }),
    ...mapGettersActions({
      visible: ['layout', 'getSendEmailDialogState', 'setSendEmailDialogState', 0]
    }),
    addresses () {
      let projects = this.projects;
      if (this.selectedRows && !this.selectAll) {
        projects = this.projects.filter(p => this.selectedRows.some(sr => sr === p.id));
      }
      return uniqBy(projects, 'contact_email');
    },
    rows () {
      return this.addresses ? this.addresses.length : 1;
    },
    selectable () {
      return this.addresses ? this.addresses.map(a => `${a.contact_name} <${a.contact_email}>`).join('\n') : null;
    }
  },
  methods: {
    copy () {
      const area = this.$refs.emailArea.$el.querySelectorAll('textarea')[0];
      area.select();
      document.execCommand('copy');
    },
    send () {
      const mailto = `mailto:${this.profile.email}?bcc=${this.addresses.map(a => a.contact_email).join(',')}`;
      window.open(mailto);
    }
  }
};
</script>

<style>

</style>
