<template>
  <div class="NewProjectForm">
    <div
      v-show="!showForm"
      class="Loader">
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
        type="flex">
        <el-col :span="18">
          <general-overview
            ref="generalOverview"
            :use-publish-rules="usePublishRules"
            :rules="rules"
            :api-errors="apiErrors"
            @mounted="mountedHandler"
          />
          <implementation-overview
            ref="implementationOverview"
            :rules="rules"
            :api-errors="apiErrors"
            @mounted="mountedHandler"
          />
          <technology-overview
            ref="technologyOverview"
            :rules="rules"
            :api-errors="apiErrors"
            @mounted="mountedHandler"
          />
          <interoperability-and-standards
            ref="interoperabilityAndStandards"
            :rules="rules"
            :api-errors="apiErrors"
            @mounted="mountedHandler"
          />
        </el-col>
        <el-col :span="6">
          <project-navigation
            :draft="isDraft"
            :new-project="isNewProject"
            @saveDraft="doSaveDraft"
            @discardDraft="doDiscardDraft"
            @publishProject="doPublishProject"
          />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import ProjectNavigation from './ProjectNavigation';
import GeneralOverview from './GeneralOverview';
import ImplementationOverview from './ImplementationOverview';
import TechnologyOverview from './TechnologyOverview';
import InteroperabilityAndStandards from './InteroperabilityAndStandards';
import { mapGetters, mapActions } from 'vuex';
import FormAPIErrorsMixin from '../mixins/FormAPIErrorsMixin.js';

export default {
  components: {
    ProjectNavigation,
    GeneralOverview,
    ImplementationOverview,
    TechnologyOverview,
    InteroperabilityAndStandards
  },
  mixins: [FormAPIErrorsMixin],
  data () {
    return {
      readyElements: 0,
      maxElements: 4,
      usePublishRules: false,
      apiErrors: {}
    };
  },
  computed: {
    ...mapGetters({
      project: 'project/getProjectData'
    }),
    isDraft () {
      return this.$route.name.includes('organisation-projects-id-edit');
    },
    isNewProject () {
      return this.$route.name.includes('organisation-projects-create');
    },
    showForm () {
      return this.readyElements === this.maxElements;
    },
    draftRules () {
      return {
        name: {
          required: true,
          min: 1
        },
        contact_email: {
          email: true
        }
      };
    },
    publishRules () {
      return {
        name: {
          required: true,
          min: 1,
          max: 128
        },
        organisation: {
          required: true
        },
        country: {
          required: true
        },
        geographic_scope: {},
        implementation_overview: {
          required: true,
          max: 512
        },
        start_date: {
          required: true
        },
        end_date: {
          required: true
        },
        contact_name: {
          required: true,
          max: 256
        },
        contact_email: {
          email: true,
          required: true
        },
        platforms: {
          required: true
        },
        digitalHealthInterventions: {
          required: true,
          min: 1
        },
        health_focus_areas: {
        },
        hsc_challenges: {
          required: true,
          min: 1
        },
        his_bucket: {
          required: true,
          min: 1
        },
        coverage: {
          subLevel: {
            required: true
          },
          health_workers: {
            required: this.project.coverageType === 1
          },
          clients: {
            required: this.project.coverageType === 1
          },
          facilities: {
            required: this.project.coverageType === 1
          },
          facilities_list: {
            required: true
          }
        },
        coverage_second_level: {
          subLevel: {
            required: false
          },
          health_workers: {
            required: false
          },
          clients: {
            required: false
          },
          facilities: {
            required: false
          },
          facilities_list: {
            required: false,
            min: 1
          }
        },
        national_level_deployment: {
          health_workers: {
            required: this.project.coverageType === 2
          },
          clients: {
            required: this.project.coverageType === 2
          },
          facilities: {
            required: this.project.coverageType === 2
          }
        },
        government_investor: {
          required: true
        },
        implementing_partners: {
          required: true
        },
        implementation_dates: {
          required: true
        },
        licenses: {},
        repository: {
          max: 256,
          url: true
        },
        mobile_application: {
          max: 256,
          url: true
        },
        wiki: {
          max: 256,
          url: true
        },
        interoperability_links: {},
        interoperability_standards: {}
      };
    },
    rules () {
      return this.usePublishRules ? this.publishRules : this.draftRules;
    }
  },
  methods: {
    ...mapActions({
      createProject: 'project/createProject',
      saveDraft: 'project/saveDraft',
      discardDraft: 'project/discardDraft',
      publishProject: 'project/publishProject',
      setLoading: 'project/setLoading'
    }),
    digitalHealthInterventionsValidator (rule, value, callback) {
      const ownDhi = this.project.digitalHealthInterventions.filter(dhi => dhi.platform === value && dhi.id);
      if (ownDhi.length === 0) {
        const error = {
          message: 'Please select one or more Digital Health Intervetions for this Software',
          field: rule.fullField
        };
        callback(error);
      } else {
        callback();
      }
    },
    mountedHandler () {
      setTimeout(() => {
        this.readyElements += 1;
      }, 300);
    },
    scrollToError () {
      this.$nextTick(() => {
        const errors = this.$el.querySelectorAll('.is-error');
        if (errors[0]) {
          errors[0].scrollIntoView();
        }
      });
    },
    async validate () {
      const validations = await Promise.all([
        this.$refs.generalOverview.validate(),
        this.$refs.implementationOverview.validate(),
        this.$refs.technologyOverview.validate(),
        this.$refs.interoperabilityAndStandards.validate()
      ]);
      return validations.reduce((a, c) => a && c, true);
    },
    clearValidation () {
      this.apiErrors = {};
      this.$refs.generalOverview.clear();
      // this.$refs.implementationOverview.clear();
      // this.$refs.technologyOverview.clear();
      // this.$refs.interoperabilityAndStandards.clear();
    },
    async doSaveDraft () {
      this.usePublishRules = false;
      this.clearValidation();
      this.$nextTick(async () => {
        // const valid = await this.validate();
        const valid = await this.$refs.generalOverview.validateDraft();
        if (valid) {
          try {
            if (this.isNewProject) {
              const id = await this.createProject();
              const localised = this.localePath({name: 'organisation-projects-id-edit', params: {...this.$route.params, id}});
              this.$router.push(localised);
            } else if (this.isDraft) {
              await this.saveDraft(this.$route.params.id);
            }
            this.$alert('Your draft has been saved successfully', 'Congratulation', {
              confirmButtonText: 'Close'
            });
          } catch (e) {
            this.apiErrors = e.response.data;
            this.setLoading(false);
          }
        } else {
          this.scrollToError();
        }
      });
    },
    async doDiscardDraft () {
      try {
        await this.$confirm('The current draft will be overwritten by the published version', 'Attention', {
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cancel',
          type: 'warning'
        });
        await this.discardDraft(this.$route.params.id);
        this.$message({
          type: 'success',
          message: 'Draft overriden with published version'
        });
      } catch (e) {
        this.setLoading(false);
        this.$message({
          type: 'info',
          message: 'Action cancelled'
        });
      }
    },
    async doPublishProject () {
      this.apiErrors = {};
      this.usePublishRules = true;
      this.$nextTick(async () => {
        const valid = await this.validate();
        if (valid) {
          try {
            await this.publishProject(this.$route.params.id);
            const localised = this.localePath({name: 'organisation-projects-id-published', params: {...this.$route.params}});
            this.$router.push(localised);
            this.$alert('Your draft has been published successfully', 'Congratulation', {
              confirmButtonText: 'Close'
            });
          } catch (e) {
            this.setLoading(false);
            this.apiErrors = e.response.data;
          }
        } else {
          this.scrollToError();
        }
      });
    }
  }

};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .NewProjectForm {
    .limitPageWidth();

    .Loader {
      display: block;
      margin: 0 auto 80px;
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
