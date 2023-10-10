<template>
  <el-dialog
    :visible.sync="visible"
    :title="$gettext('Edit team members') | translate"
    modal
    custom-class="SaveFiltersDialog"
  >
    <div>
      <div >
        <translate key="team">
          Add team members (editors)
        </translate>
        <Tooltip :text="$gettext('Project editors can change and update all project information.') | translate" />
      </div>
      <TeamSelector v-model="form.team" />
    </div>

    <span slot="footer">
      <el-row type="flex" align="center">
        <el-col class="SecondaryButtons">
          <el-button type="text" class="CancelButton" @click="cancel">
            <translate>Cancel</translate>
          </el-button>
        </el-col>
        <el-col class="PrimaryButtons">
          <el-button type="primary" @click="saveGroup">
            <translate>Save</translate>
          </el-button>
        </el-col>
      </el-row>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Tooltip from '@/components/dashboard/Tooltip'
import TeamSelector from '@/components/project/TeamSelector'

export default {
  components: {
    Tooltip,
    TeamSelector
  },
  data() {
    return {
      form: {
        team: [],
      },
      originalTeam: null,
      rules: {
        team: [
          {
            required: true,
            message: this.$gettext('At least one team member is required'),
            trigger: 'blur'
          },
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      dialog: 'layout/getTeamMemberDialogState',
      savedFilters: 'dashboard/getSavedFilters'
    }),
    user() {
      return this.$auth.user
    },
    visible: {
      get () {
        return this.dialog.visible
      },
      set (val) {
        this.setTeamMemberDialogState(val)
      }
    }
  },
  watch: {
    dialog(val) {
      if (val?.visible) {
        this.form.team = []
        this.loadGroup(val.projectId)
      }
    },
  },
  methods: {
    ...mapActions({
      setTeamMemberDialogState: 'layout/setTeamMemberDialogState',
      loadUserProjects: 'projects/loadUserProjects',
    }),
    cancel() {
      this.setTeamMemberDialogState(false)
    },
    apply() {
      console.log('apply')
    },
    async loadGroup(projectId) {
      try {
        const { data } = await this.$axios.get(`/api/projects/${projectId}/groups/`)
        this.originalTeam = data
        this.form.team = data.team
      } catch (error) {
        console.log("🚀 ~ file: EditTeamMembersDialog.vue:108 ~ loadGroup ~ error:", error)
      }
    },
    async saveGroup() {
      try {
        const teamIds = this.form.team.filter(d => typeof d === 'number')
        const teamEmails = this.form.team.filter(d => typeof d === 'string')
        const team = {
          ...this.originalTeam,
          team: teamIds,
          new_team_emails: teamEmails,
          viewers: this.originalTeam.viewers
        }
        await this.$axios.put(`/api/projects/${this.dialog.projectId}/groups/`, team)
        this.setTeamMemberDialogState({dialog: false, projectId: null})

        const currentUserAdded = teamIds.includes(this.user.id)
        const currentUserRemoved = !teamIds.includes(this.user.id) && this.originalTeam.team.includes(this.user.id)
        if (currentUserAdded || currentUserRemoved) {
          await Promise.all([
            this.$auth.fetchUser(),
            this.loadUserProjects(),
          ])
        }
      } catch (error) {
        console.log("🚀 ~ file: EditTeamMembersDialog.vue:138 ~ saveGroup ~ error:", error)
      }
    },
  }
}
</script>

<style lang="less">
@import '../../assets/style/variables.less';
@import '../../assets/style/mixins.less';

.SaveFiltersDialog {
  .el-form,
  .el-form-item {
    margin: 20px 0;
  }
}
</style>