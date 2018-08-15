<template>
  <div class="NewProjectForm">
    <el-form
      :model="project"
      :rules="rules"
      label-position="top"
      @submit.native.prevent
    >
      <el-row type="flex">
        <el-col :span="18">
          <general-overview @mounted="mountedHandler" />
          <implementation-overview @mounted="mountedHandler" />
          <technology-overview @mounted="mountedHandler"/>
          <interoperability-and-standards @mounted="mountedHandler"/>
        </el-col>
        <el-col :span="6">
          <project-navigation />
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
import { mapGetters } from 'vuex';

export default {
  components: {
    ProjectNavigation,
    GeneralOverview,
    ImplementationOverview,
    TechnologyOverview,
    InteroperabilityAndStandards
  },
  data () {
    return {};
  },
  computed: {
    ...mapGetters({
      project: 'project/getProjectData'
    }),
    draftRules () {
      return {
        name: [
          {required: true, message: 'This is required', trigger: 'blur'}
        ]
      };
    },
    rules () {
      return {
        name: [
          {required: true, message: 'This is required', trigger: 'blur'}
        ]
      };
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .NewProjectForm {
    .limitPageWidth();

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
