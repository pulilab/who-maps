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
      :model="project"
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

export default {
  components: {
    ProjectNavigation,
    GeneralOverview,
    ImplementationOverview,
    TechnologyOverview,
    InteroperabilityAndStandards
  },
  data () {
    return {
      readyElements: 0,
      maxElements: 4,
      usePublishRueles: false
    };
  },
  computed: {
    ...mapGetters({
      project: 'project/getProjectData'
    }),
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
      return {
        name: [
          {required: true, message: 'This is required', trigger: 'blur'}
        ],
        contact_email: [
          {type: 'email', message: 'Please insert a valid email', trigger: 'blur'}
        ]
      };
    },
    publishRules () {
      return {
        name: [
          {required: true, message: 'This is required', trigger: 'blur'}
        ]
      };
    },
    rules () {
      return this.usePublishRueles ? this.publishRules : this.draftRules;
    }
  },
  methods: {
    ...mapActions({
      createProject: 'project/createProject',
      saveDraft: 'project/saveDraft'
    }),
    mountedHandler () {
      setTimeout(() => {
        this.readyElements += 1;
      }, 300);
    },
    doSaveDraft () {
      this.$refs.projectForm.validate(async valid => {
        if (this.isNewProject) {
          const id = await this.createProject();
          const localised = this.localePath({name: 'index-projects-id-edit', params: {id}});
          this.$router.push(localised);
        } else if (this.isDraft) {
          await this.saveDraft(this.$route.params.id);
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
