<template>
  <div class="NewProjectForm">
    <el-form
      :model="project"
      :rules="rules"
      label-position="top"
      @submit.native.prevent>
      <el-row type="flex">

        <el-col :span="18">
          <general-overview />
          <implementation-overview />
          <technology-overview />
          <interoperability-and-standards />
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
  },
  methods: {
  }
};
</script>

<style lang="less">
.NewProjectForm {
}
</style>
