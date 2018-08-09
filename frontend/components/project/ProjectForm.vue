<template>
  <div class="NewProjectForm">

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

  </div>
</template>

<script>
import ProjectNavigation from './ProjectNavigation';
import GeneralOverview from './GeneralOverview';
import ImplementationOverview from './ImplementationOverview';
import TechnologyOverview from './TechnologyOverview';
import InteroperabilityAndStandards from './InteroperabilityAndStandards';

export default {
  components: {
    ProjectNavigation,
    GeneralOverview,
    ImplementationOverview,
    TechnologyOverview,
    InteroperabilityAndStandards
  },
  methods: {
  }
};
</script>

<style lang="less">
.NewProjectForm {
}
</style>
