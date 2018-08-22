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
      :model="model"
      :rules="rules"
      label-position="top"
      @submit.native.prevent
    >
      <el-row
        v-show="showForm"
        type="flex">
        <el-col :span="18">
          <general-overview @mounted="mountedHandler" />
          <implementation-overview @mounted="mountedHandler" />
          <technology-overview @mounted="mountedHandler"/>
          <interoperability-and-standards @mounted="mountedHandler"/>
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
import { max, required, requiredList, url, notEmpty } from '../../utilities/form.js';
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
      usePublishRules: false
    };
  },
  computed: {
    ...mapGetters({
      project: 'project/getProjectData'
    }),
    model () {
      const platforms = this.project.platforms.reduce((a, c, index) => {
        return { ...a, [`platforms.${index}`]: c };
      }, {});

      const implementing_partners = this.project.implementing_partners.reduce((a, c, index) => {
        return { ...a, [`implementing_partners.${index}`]: c };
      }, {});

      const coverage = this.project.coverage.reduce((a, c, index) => {
        return { ...a, [`coverage.${index}`]: c };
      }, {});

      const coverage_second_level = this.project.coverage_second_level.reduce((a, c, index) => {
        return { ...a, [`coverage_second_level.${index}`]: c };
      }, {});

      return {
        ...this.project,
        ...platforms,
        ...implementing_partners,
        ...coverage,
        ...coverage_second_level
      };
    },
    isDraft () {
      return this.$route.name.includes('index-projects-id-edit');
    },
    isNewProject () {
      return this.$route.name.includes('index-projects-create');
    },
    showForm () {
      return this.readyElements === this.maxElements;
    },
    draftRules () {
      const {listProps} = this.generateCollectionRules([], [], []);
      const rules = {
        name: [
          required()
        ],
        contact_email: [
          {type: 'email', message: 'Please insert a valid email', trigger: 'blur'}
        ]
      };
      const exclude = ['platforms', 'coverage', 'implementing_partners', 'coverage_second_level'];
      for (let item in this.model) {
        if (!listProps.includes(item) && !exclude.includes(item)) {
          if (!rules[item]) {
            rules[item] = [];
          }
          rules[item].push({ validator: this.validatorGenerator(item), trigger: 'blur' });
        }
      }
      for (let item of listProps) {
        if (!rules[item]) {
          rules[item] = [];
        }
        rules[item].push({ validator: this.collectionValidatorGenerator(item), trigger: 'blur' });
      }
      return rules;
    },
    publishRules () {
      const platformRules = [
        {type: 'number', required: true, message: 'This is requried'},
        {validator: this.digitalHealthInterventionsValidator}
      ];

      const coverageRules = [
        {type: 'string', required: true, message: 'This is requried'},
        {validator: this.coverageDataValidator}
      ];

      const {collectionRules, listProps} = this.generateCollectionRules(platformRules, [max(64)], coverageRules);

      const rules = {
        name: [
          required(),
          max(128)
        ],
        organisation: [
          required()
        ],
        country: [
          required('number')
        ],
        geographic_scope: [],
        implementation_overview: [
          required(),
          max(512)
        ],
        start_date: [
          {validator: this.dateValidator, trigger: 'blur'}
        ],
        end_date: [
          {validator: this.dateValidator, trigger: 'blur'}
        ],
        contact_name: [
          required(),
          max(256)
        ],
        contact_email: [
          {type: 'email', message: 'Please insert a valid email', trigger: 'blur'},
          required()
        ],
        ...collectionRules.platforms,
        digitalHealthInterventions: [], // Validated inside platforms
        health_focus_areas: [],
        hsc_challenges: [
          requiredList()
        ],
        his_bucket: [
          requiredList()
        ],
        ...collectionRules.coverage,
        coverageData: [],
        ...collectionRules.coverage_second_level,
        'national_level_deployment.health_workers': [
          this.project.coverageType === 2 ? required() : {type: 'number'}
        ],
        'national_level_deployment.clients': [
          this.project.coverageType === 2 ? required() : {type: 'number'}
        ],
        'national_level_deployment.facilities': [
          this.project.coverageType === 2 ? required() : {type: 'number'}
        ],
        government_investor: [
          required('number')
        ],
        ...collectionRules.implementing_partners,
        implementation_dates: [
          required()
        ],
        licenses: [],
        repository: [
          max(256),
          url()
        ],
        mobile_application: [
          max(256),
          url()
        ],
        wiki: [
          max(256),
          url()
        ],
        interoperability_links: [],
        interoperability_standards: []
      };

      for (let item in rules) {
        if (!listProps.includes(item)) {
          rules[item].push({ validator: this.validatorGenerator(item), trigger: 'blur' });
        } else {
          rules[item].push({ validator: this.collectionValidatorGenerator(item), trigger: 'blur' });
        }
      }
      return rules;
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
      publishProject: 'project/publishProject'
    }),
    generateCollectionRules (platformRules, implementingPartnersRules, coverageRules) {
      const platforms = this.project.platforms.reduce((a, c, index) => {
        return { ...a, [`platforms.${index}`]: platformRules };
      }, {});

      const implementing_partners = this.project.implementing_partners.reduce((a, c, index) => {
        return { ...a, [`implementing_partners.${index}`]: implementingPartnersRules };
      }, {});

      const coverage = this.project.coverage.reduce((a, c, index) => {
        return { ...a, [`coverage.${index}`]: coverageRules };
      }, {});

      const coverage_second_level = this.project.coverage_second_level.reduce((a, c, index) => {
        return { ...a, [`coverage_second_level.${index}`]: coverageRules };
      }, {});

      const listProps = [
        ...Object.keys(platforms),
        ...Object.keys(implementing_partners),
        ...Object.keys(coverage),
        ...Object.keys(coverage_second_level)
      ];

      return {
        collectionRules: {
          platforms,
          implementing_partners,
          coverage,
          coverage_second_level
        },
        listProps
      };
    },
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
    coverageDataValidator (rule, value, callback) {
      if (this.project.coverageType === 1) {
        const cov = this.project.coverageData[value];
        if (cov && notEmpty(cov.facilities) && notEmpty(cov.health_workers) && notEmpty(cov.clients)) {
          callback();
        } else {
          const error = {
            message: 'Health workers facilities or clients value missing or malformed',
            field: rule.fullField
          };
          callback(error);
        }
      }
    },
    dateValidator (rule, value, callback) {
      if (this.project.start_date && this.project.end_date) {
        const start = new Date(this.project.start_date);
        const end = new Date(this.project.end_date);
        if (start.getTime() > end.getTime()) {
          const error = {
            message: 'End Date must be greater than Start Date',
            field: rule.fullField
          };
          callback(error);
        } else {
          callback();
        }
      } else {
        const error = {
          message: 'This field is required',
          field: rule.fullField
        };
        callback(error);
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
    async doSaveDraft () {
      this.usePublishRules = false;
      this.deleteFormAPIErrors();
      this.$nextTick(() => {
        this.$refs.projectForm.validate(async valid => {
          if (valid) {
            try {
              if (this.isNewProject) {
                const id = await this.createProject();
                const localised = this.localePath({name: 'index-projects-id-edit', params: {id}});
                this.$router.push(localised);
              } else if (this.isDraft) {
                await this.saveDraft(this.$route.params.id);
              }
              this.$alert('Your draft has been saved successfully', 'Congratulation', {
                confirmButtonText: 'Close'
              });
            } catch (e) {
              this.setFormAPIErrors(e);
              this.$refs.projectForm.validate(() => {
                this.scrollToError();
              });
            }
          } else {
            this.scrollToError();
          }
        });
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
        this.$message({
          type: 'info',
          message: 'Action cancelled'
        });
      }
    },
    async doPublishProject () {
      this.usePublishRules = true;
      this.deleteFormAPIErrors();
      this.$nextTick(() => {
        this.$refs.projectForm.validate(async (valid) => {
          if (valid) {
            try {
              await this.publishProject(this.$route.params.id);
              const localised = this.localePath({name: 'index-projects-id-published', params: {...this.$route.params}});
              this.$router.push(localised);
              this.$alert('Your draft has been published successfully', 'Congratulation', {
                confirmButtonText: 'Close'
              });
            } catch (e) {
              this.setFormAPIErrors(e);
              this.$refs.projectForm.validate(() => {
                this.scrollToError();
              });
            }
          } else {
            this.scrollToError();
          }
        });
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
