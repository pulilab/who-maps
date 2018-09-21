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
          <country-custom
            ref="countryCustom"
            :use-publish-rules="usePublishRules"
            :api-errors="apiErrors"
            @mounted="mountedHandler"
          />
          <donor-custom
            ref="donorCustom"
            :use-publish-rules="usePublishRules"
            :api-errors="apiErrors"
            @mounted="mountedHandler"
          />
        </el-col>
        <el-col :span="6">
          <project-navigation
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
import GeneralOverview from './sections/GeneralOverview';
import ImplementationOverview from './sections/ImplementationOverview';
import TechnologyOverview from './sections/TechnologyOverview';
import InteroperabilityAndStandards from './sections/InteroperabilityAndStandards';
import CountryCustom from './sections/CountryCustom';
import DonorCustom from './sections/DonorCustom';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ProjectNavigation,
    GeneralOverview,
    ImplementationOverview,
    TechnologyOverview,
    InteroperabilityAndStandards,
    CountryCustom,
    DonorCustom
  },
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
      return this.readyElements > this.maxElements;
    },
    draftRules () {
      return {
        name: {
          required: true,
          min: 1
        },
        contact_email: {
          email: true
        },
        team: {
          required: true,
          min: 1
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
          required: false
        },
        contact_name: {
          required: true,
          max: 256
        },
        contact_email: {
          email: true,
          required: true
        },
        team: {
          required: true
        },
        platforms: {
          required: true
        },
        strategies: {
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
          district: {
            required: true
          },
          health_workers: {
            required: true,
            integer: true
          },
          clients: {
            required: true,
            integer: true
          },
          facilities: {
            required: true,
            integer: true
          },
          facilities_list: {
            required: true,
            min: 1
          }
        },
        coverage_second_level: {
          district: {
            required: false
          },
          health_workers: {
            required: false,
            integer: true
          },
          clients: {
            required: false,
            integer: true
          },
          facilities: {
            required: false,
            integer: true
          },
          facilities_list: {
            required: false
          }
        },
        national_level_deployment: {
          health_workers: {
            required: true
          },
          clients: {
            required: true
          },
          facilities: {
            required: true
          }
        },
        government_investor: {
          required: true
        },
        implementing_partners: {
          required: true
        },
        donors: {
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
          message: this.$gettext('Please select one or more Digital Health Intervetions for this Software'),
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
    handleErrorMessages () {
      this.$nextTick(() => {
        const errors = [...this.$el.querySelectorAll('.is-error')];
        const visibleErrors = errors.filter(e => e.offsetParent !== null);
        if (visibleErrors && visibleErrors.length > 0) {
          visibleErrors[0].scrollIntoView();
        } else {
          this.$alert(this.$gettext('There was an un-caught validation error an automatic report has been submitted'), this.$gettext('Warning'), {
            confirmButtonText: this.$gettext('Close')
          });
          this.$raven.captureMessage('Un-caught validation error in project page', {
            level: 'warning',
            extra: {
              apiErrors: this.apiErrors,
              errors
            }
          });
        }
      });
    },
    async validate () {
      const validations = await Promise.all([
        this.$refs.generalOverview.validate(),
        this.$refs.implementationOverview.validate(),
        this.$refs.technologyOverview.validate(),
        this.$refs.interoperabilityAndStandards.validate(),
        this.$refs.countryCustom.validate(),
        this.$refs.donorCustom.validate()
      ]);
      console.log('root validations', validations);
      return validations.reduce((a, c) => a && c, true);
    },
    clearValidation () {
      this.apiErrors = {};
      this.$refs.generalOverview.clear();
      this.$refs.implementationOverview.clear();
      this.$refs.technologyOverview.clear();
      this.$refs.interoperabilityAndStandards.clear();
      this.$refs.countryCustom.clear();
      this.$refs.donorCustom.clear();
    },
    async doSaveDraft () {
      this.clearValidation();
      this.usePublishRules = false;
      this.$nextTick(async () => {
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
            this.$alert(this.$gettext('Your draft has been saved successfully'), this.$gettext('Congratulation'), {
              confirmButtonText: this.$gettext('Close')
            });
            return;
          } catch (e) {
            this.apiErrors = e.response.data;
            this.setLoading(false);
          }
        }
        this.handleErrorMessages();
      });
    },
    async doDiscardDraft () {
      try {
        await this.$confirm(this.$gettext('The current draft will be overwritten by the published version'), this.$gettext('Attention'), {
          confirmButtonText: this.$gettext('Ok'),
          cancelButtonText: this.$gettext('Cancel'),
          type: 'warning'
        });
        await this.discardDraft(this.$route.params.id);
        this.$message({
          type: 'success',
          message: this.$gettext('Draft overriden with published version')
        });
      } catch (e) {
        this.setLoading(false);
        this.$message({
          type: 'info',
          message: this.$gettext('Action cancelled')
        });
      }
    },
    async doPublishProject () {
      this.clearValidation();
      this.usePublishRules = true;
      this.$nextTick(async () => {
        const valid = await this.validate();
        if (valid) {
          try {
            await this.publishProject(this.$route.params.id);
            const localised = this.localePath({name: 'organisation-projects-id-published', params: {...this.$route.params}});
            this.$router.push(localised);
            this.$alert(this.$gettext('Your draft has been published successfully'), this.$gettext('Congratulation'), {
              confirmButtonText: this.$gettext('Close')
            });
            return;
          } catch (e) {
            this.setLoading(false);
            this.apiErrors = e.response.data;
          }
        }
        this.handleErrorMessages();
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
