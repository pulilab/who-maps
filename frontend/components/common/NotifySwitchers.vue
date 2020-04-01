<template>
  <div v-if="!hideAdminNotifications">
    <span class="NotifyTitle">
      <translate>Email Notifications (Providing updates related to your role)</translate>
    </span>
    <el-form-item v-if="project_approval_request_notification !== undefined">
      <div class="Switch-container">
        <filter-switch
          :value="project_approval_request_notification"
          :label="$gettext('Weekly project approval status (Y/N)') | translate"
          :tooltip="$gettext('If your country choses to approve/verify projects, this option will provide you a weekly digest of the projects awaiting feedback.  You can return to your profile at any time and update this selection.') | translate"
          @change="$emit('update:project_approval_request_notification', $event)"
        />
      </div>
    </el-form-item>
    <el-form-item v-if="project_updates_notification !== undefined">
      <div class="Switch-container">
        <filter-switch
          :value="project_updates_notification"
          :label="$gettext('Project updates') | translate"
          :tooltip="$gettext('Lorem ipsum') | translate"
          @change="$emit('update:project_updates_notification', $event)"
        />
      </div>
    </el-form-item>
    <el-form-item v-if="role_request_notification !== undefined">
      <div class="Switch-container">
        <filter-switch
          :value="role_request_notification"
          :label="$gettext('User role requests') | translate"
          :tooltip="$gettext('If you are not part of a Ministry of Health or Investor team, select this option.  You will still have full access to all standard data within the DHA, and be able to publish and add all new projects for immediate publication.') | translate"
          @change="$emit('update:role_request_notification', $event)"
        />
      </div>
    </el-form-item>
    <div>&nbsp;</div>
  </div>
</template>

<script>
/* eslint-disable vue/prop-name-casing */

import FilterSwitch from '~/components/dashboard/FilterSwitch';
export default {
  components: {
    FilterSwitch
  },
  props: {
    project_updates_notification: {
      type: Boolean,
      required: false,
      default: undefined
    },
    project_approval_request_notification: {
      type: Boolean,
      required: false,
      default: undefined
    },
    role_request_notification: {
      type: Boolean,
      required: false,
      default: undefined
    }
  },
  computed: {
    hideAdminNotifications () {
      return (this.project_updates_notification === undefined &&
        this.project_approval_request_notification === undefined &&
        this.role_request_notification === undefined);
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  .NotifyTitle {
    font-size: @fontSizeBase;
    font-weight: bold;
    display: block;
    margin-bottom: 15px;
  }
</style>
