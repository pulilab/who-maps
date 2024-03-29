<template>
  <div class="NewProjectForm">
    <div
      v-show="!showForm"
      class="Loader"
    >
      <div />
      <span>Loading</span>
    </div>
    <el-form
      ref="projectForm"
      label-position="top"
      @submit.native.prevent
    >
      <el-row
        v-show="showForm"
        type="flex"
      >
        <el-col :span="18">
          <general-overview
            ref="generalOverview"
            :use-publish-rules="usePublishRules"
            :rules="rules"
            :draft-rules="draftRules"
            :publish-rules="publishRules"
            :api-errors="apiErrors"
            :prepend-title="1"
            @hook:mounted="mountedHandler"
            @hook:created="createdHandler"
          />
          <implementation-overview
            ref="implementationOverview"
            :rules="rules"
            :draft-rules="draftRules"
            :publish-rules="publishRules"
            :api-errors="apiErrors"
            :prepend-title="2"
            @hook:mounted="mountedHandler"
            @hook:created="createdHandler"
          />
          <stage-overview
            ref="stageOverview"
            :use-publish-rules="usePublishRules"
            :rules="rules"
            :draft-rules="draftRules"
            :publish-rules="publishRules"
            :api-errors="apiErrors"
            :prepend-title="3"
            @hook:mounted="mountedHandler"
            @hook:created="createdHandler"
          />
          <licensing-overview
            ref="licensingOverview"
            :rules="rules"
            :draft-rules="draftRules"
            :publish-rules="publishRules"
            :api-errors="apiErrors"
            :prepend-title="4"
            @hook:mounted="mountedHandler"
            @hook:created="createdHandler"
          />
          <technology-overview
            ref="technologyOverview"
            :rules="rules"
            :draft-rules="draftRules"
            :publish-rules="publishRules"
            :api-errors="apiErrors"
            :prepend-title="5"
            @hook:mounted="mountedHandler"
            @hook:created="createdHandler"
          />
          <interoperability-and-standards
            ref="interoperabilityAndStandards"
            :rules="rules"
            :draft-rules="draftRules"
            :publish-rules="publishRules"
            :api-errors="apiErrors"
            :prepend-title="6"
            @hook:mounted="mountedHandler"
            @hook:created="createdHandler"
          />
          <country-custom
            ref="countryCustom"
            :use-publish-rules="usePublishRules"
            :draft-rules="draftRules"
            :publish-rules="publishRules"
            :api-errors="apiErrors"
            :prepend-title="7"
            @hook:mounted="mountedHandler"
            @hook:created="createdHandler"
          />
          <donor-custom
            ref="donorCustom"
            :use-publish-rules="usePublishRules"
            :draft-rules="draftRules"
            :publish-rules="publishRules"
            :api-errors="apiErrors"
            :prepend-title="8"
            @hook:mounted="mountedHandler"
            @hook:created="createdHandler"
          />
        </el-col>
        <el-col :span="6">
          <ProjectNavigation
            @saveDraft="doSaveDraft"
            @discardDraft="doDiscardDraft"
            @archiveProject="doArchiveProject"
            @publishProject="doPublishProject"
          />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { publishRules, draftRules } from '@/utilities/projects'
import ProjectNavigation from './ProjectNavigation'
import GeneralOverview from './sections/GeneralOverview'
import StageOverview from '@/components/project/sections/StageOverview'
import LicensingOverview from './sections/LicensingOverview'
import ImplementationOverview from './sections/ImplementationOverview'
import TechnologyOverview from './sections/TechnologyOverview'
import InteroperabilityAndStandards from './sections/InteroperabilityAndStandards'
import CountryCustom from './sections/CountryCustom'
import DonorCustom from './sections/DonorCustom'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ProjectNavigation,
    GeneralOverview,
    StageOverview,
    ImplementationOverview,
    LicensingOverview,
    TechnologyOverview,
    InteroperabilityAndStandards,
    CountryCustom,
    DonorCustom
  },
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      readyElements: 0,
      createdElements: 0,
      usePublishRules: false,
      apiErrors: {}
    }
  },
  computed: {
    ...mapGetters({
      project: 'project/getProjectData',
      countryAnswers: 'project/getCountryAnswers',
      donorAnswers: 'project/getDonorsAnswers'
    }),
    projectId() {
      return this.$route.params.id
    },
    isDraft () {
      return this.$route.name.includes('organisation-projects-id-edit')
    },
    isNewProject () {
      return this.$route.name.includes('organisation-projects-create')
    },
    showForm () {
      return this.readyElements >= this.createdElements
    },
    draftRules: draftRules,
    publishRules: publishRules,
    rules () {
      return this.usePublishRules ? this.publishRules : this.draftRules
    }
  },
  mounted () {
    if (this.$route.query.reloadDataFromStorage) {
      this.$nextTick(() => {
        this.$nuxt.$loading.start()
        try {
          const stored = JSON.parse(
            window.localStorage.getItem('rescuedProject')
          )
          this.initProjectState(stored)
        } catch (e) {
          this.$alert(
            this.$gettext('Failed to restore auto-saved project'),
            this.$gettext('Warning'),
            {
              confirmButtonText: this.$gettext('OK')
            }
          )
        }
        window.localStorage.removeItem('rescuedProject')
        this.$router.replace({ ...this.$route, query: undefined })
        this.$nuxt.$loading.finish()
      })
    }
  },
  methods: {
    ...mapActions({
      createProject: 'project/createProject',
      saveDraft: 'project/saveDraft',
      discardDraft: 'project/discardDraft',
      publishProject: 'project/publishProject',
      setLoading: 'project/setLoading',
      initProjectState: 'project/initProjectState',
      archiveProject: 'project/archiveProject'
    }),
    digitalHealthInterventionsValidator (rule, value, callback) {
      const ownDhi = this.project.digitalHealthInterventions.filter(
        dhi => dhi.platform === value && dhi.id
      )
      if (ownDhi.length === 0) {
        const error = {
          message: this.$gettext(
            'Please select one or more Digital Health Intervetions for this Software'
          ),
          field: rule.fullField
        }
        callback(error)
      } else {
        callback()
      }
    },
    createdHandler () {
      this.createdElements += 1
    },
    mountedHandler () {
      setTimeout(() => {
        this.readyElements += 1
      }, 300)
    },
    async unCaughtErrorHandler (errors) {
    const project = {
      ...this.project,
      country_custom_answers: this.countryAnswers,
      donor_custom_answers: this.donorAnswers
    }

    if (this.$sentry) {
        this.$sentry.captureMessage(
          'Un-caught validation error in project page',
          {
            level: 'error',
            extra: {
              apiErrors: this.apiErrors,
              errors,
              project
            }
          }
        )
      }

      try {
        await this.$confirm(
          this.$gettext(
            'There was an un-caught validation error an automatic report has been submitted'
          ),
          this.$gettext('Warning'),
          {
            confirmButtonText: this.$gettext('Recover & Reload'),
            cancelButtonText: this.$gettext('Discard changes')
          }
        )
        const toStore = JSON.stringify(project)
        window.localStorage.setItem('rescuedProject', toStore)
        const newUrl =
          window.location.origin +
          this.$route.path +
          '?reloadDataFromStorage=true'
        window.location.href = newUrl
      } catch (e) {
        console.log('User declined the option to save, just reloading')
        window.location.reload(true)
      }
    },
    handleErrorMessages () {
      this.$nextTick(() => {
        const errors = [...this.$el.querySelectorAll('.is-error')]
        const visibleErrors = errors.filter(e => e.offsetParent !== null)
        if (visibleErrors && visibleErrors.length > 0) {
          visibleErrors[0].scrollIntoView()
        } else {
          this.unCaughtErrorHandler(errors)
        }
      })
    },
    async validate () {
      const validations = await Promise.all([
        this.$refs.generalOverview.validate(),
        this.$refs.implementationOverview.validate(),
        this.$refs.stageOverview.validate(),
        this.$refs.technologyOverview.validate(),
        this.$refs.interoperabilityAndStandards.validate(),
        this.$refs.countryCustom.validate(),
        this.$refs.donorCustom.validate()
      ])
      console.log('root validations', validations)
      return validations.reduce((a, c) => a && c, true)
    },
    async validateDraft () {
      const validations = await Promise.all([
        this.$refs.generalOverview.validateDraft(),
        this.$refs.stageOverview.validateDraft()
      ])
      console.log('root draft validations', validations)
      return validations.reduce((a, c) => a && c, true)
    },
    clearValidation () {
      this.apiErrors = {}
      this.$refs.generalOverview.clear()
      this.$refs.implementationOverview.clear()
      this.$refs.stageOverview.clear()
      this.$refs.technologyOverview.clear()
      this.$refs.interoperabilityAndStandards.clear()
      this.$refs.countryCustom.clear()
      this.$refs.donorCustom.clear()
    },
    async doSaveDraft () {
      this.clearValidation()
      this.usePublishRules = false
      this.$nextTick(async () => {
        const valid = await this.validateDraft()
        if (valid) {
          try {
            if (this.isNewProject) {
              const id = await this.createProject()
              const localised = this.localePath({
                name: 'organisation-projects-id-edit',
                params: { ...this.$route.params, id }
              })
              this.$router.push(localised)
            } else if (this.isDraft) {
              await this.saveDraft(this.$route.params.id)
              location.reload()
            }
            this.$alert(
              this.$gettext('Your draft has been saved successfully'),
              this.$gettext('Congratulation'),
              {
                confirmButtonText: this.$gettext('Close')
              }
            )
            return
          } catch (e) {
            if (e.response) {
              this.apiErrors = e.response.data
            } else {
              console.error(e)
            }
            this.setLoading(false)
          }
        }
        this.handleErrorMessages()
      })
    },
    async doDiscardDraft () {
      try {
        await this.$confirm(
          this.$gettext(
            'The current draft will be overwritten by the published version'
          ),
          this.$gettext('Warning'),
          {
            confirmButtonText: this.$gettext('Ok'),
            cancelButtonText: this.$gettext('Cancel'),
            type: 'warning'
          }
        )
        await this.discardDraft(this.$route.params.id)
        this.$message({
          type: 'success',
          message: this.$gettext('Draft overriden with published version')
        })
      } catch (e) {
        this.setLoading(false)
        this.$message({
          type: 'info',
          message: this.$gettext('Action cancelled')
        })
      }
    },
    async doArchiveProject() {
      try {
        await this.$confirm(
          this.$gettext('The current project will be archived. You will find it on "My projects" page where you can initiate to restore it if needed.'),
          this.$gettext('Warning'),
          {
            confirmButtonText: this.$gettext('OK'),
            cancelButtonText: this.$gettext('Cancel')
          }
        )

        await this.archiveProject(this.projectId)
        await this.$auth.fetchUser()
        const path = this.localePath({ name: 'organisation-projects', query: { list: 'archive'} })
        this.$router.push(path)
      } catch (e) {
        if (e !== 'cancel') {
          console.log('🚀 ~ file: ProjectForm.vue:380 ~ doArchiveProject ~ e:', e)
        }
      }
    },
    async doPublishProject () {
      this.clearValidation()
      this.usePublishRules = true
      this.$nextTick(async () => {
        const valid = await this.validate()
        if (valid) {
          try {
            await this.publishProject(this.$route.params.id)
            const localised = this.localePath({
              name: 'organisation-projects-id-published',
              params: { ...this.$route.params }
            })
            this.$router.push(localised)
            this.$alert(
              this.$gettext('Your draft has been published successfully'),
              this.$gettext('Congratulation'),
              {
                confirmButtonText: this.$gettext('Close')
              }
            )
            return
          } catch (e) {
            if (e.response && e.response.status !== 500) {
              this.setLoading(false)
              this.apiErrors = e.response.data
            } else {
              console.log('🚀 ~ file: ProjectForm.vue:413 ~ this.$nextTick ~ e:', e)
            }
          }
        }
        this.handleErrorMessages()
      })
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/variables.less';
@import '../../assets/style/mixins.less';

.NewProjectForm {
  // .limitPageWidth();

  .Loader {
    display: block;
    margin: 0 auto 80px;
    span {
      margin: 0 auto;
    }
  }

  > .el-form {
    > .el-row > .el-col {
      // form fieldsets
      &:first-child {
        width: calc(100% - @projectAsideNavWidth - 20px);
        margin-right: 20px;
      }

      // aside navigation
      &:last-child {
        width: @projectAsideNavWidth;
      }
    }
  }
}
</style>
