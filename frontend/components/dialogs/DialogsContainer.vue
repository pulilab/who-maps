<template>
  <div class="DialogsContainer">
    <DigitalHealthInterventionsDialog />
    <DashboardFiltersDialog />
    <SaveFilterDialog />
    <SendEmailDialog />
    <ProjectApprovalDialog />
    <EditSubLevelDialog />
    <ReferenceDocumentDialog />
    <EditTeamMembersDialog />
  </div>
</template>

<script>
import { mapGettersActions } from '../..//utilities/form'
import DigitalHealthInterventionsDialog from './DigitalHealthInterventionsDialog'
import DashboardFiltersDialog from './DashboardFiltersDialog'
import SaveFilterDialog from './SaveFilterDialog'
import SendEmailDialog from './SendEmailDialog'
import ProjectApprovalDialog from './ProjectApprovalDialog'
import EditSubLevelDialog from './EditSubLevelDialog'
import ReferenceDocumentDialog from './ReferenceDocumentDialog'
import EditTeamMembersDialog from './EditTeamMembersDialog'

export default {
  components: {
    DigitalHealthInterventionsDialog,
    DashboardFiltersDialog,
    SaveFilterDialog,
    SendEmailDialog,
    ProjectApprovalDialog,
    EditSubLevelDialog,
    ReferenceDocumentDialog,
    EditTeamMembersDialog,
  },
  computed: {
    ...mapGettersActions({
      showEmptyProfileWarning: ['layout', 'getShowEmptyProfileWarning', 'setShowEmptyProfileWarning']
    })
  },
  watch: {
    showEmptyProfileWarning: {
      immediate: true,
      handler (show) {
        if (show) {
          this.$alert(
            this.$gettext('Please fill your profile first'),
            this.$gettext('Warning'),
            {
              confirmButtonText: 'OK',
              callback: action => {
                this.showEmptyProfileWarning = false
                this.$router.replace(this.localePath({ name: 'organisation-edit-profile', params: this.$route.params, query: undefined }))
              }
            })
        }
      }
    }
  }
}
</script>