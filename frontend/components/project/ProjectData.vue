<template>
  <div class="ProjectData">
    <el-row
      type="flex">
      <el-col :span="18">
        <collapsible-card title="1. General Overview">

          <simple-field
            :content="project.name"
            header="Project Name"
          />

          <simple-field header="Organisation">
            <organisation-item
              :id="project.organisation"
            />
          </simple-field>

          <simple-field header="Project country">
            <country-item
              :id="project.country"
              :show-flag="false"
            />
          </simple-field>

          <simple-field
            :content="project.geographic_scope"
            header="Geographic scope"
          />

          <simple-field
            :content="project.implementation_overview"
            header="Overview of the digital health implementation"
          />
          <el-row>
            <el-col :span="12">
              <simple-field
                :content="project.start_date"
                header="Project start date"
              />
            </el-col>
            <el-col :span="12">
              <simple-field
                :content="project.end_date"
                header="Project end date"
              />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <simple-field
                :content="project.contact_name"
                header="Contact name"
              />
            </el-col>
            <el-col :span="12">
              <simple-field
                :content="project.contact_email"
                header="Contact email"
              />
            </el-col>
          </el-row>
          <div class="GrayArea">
            <simple-field
              header="Team members"
            >
              <team-list :value="project.team" />
            </simple-field>
            <simple-field
              header="Viewers "
            >
              <team-list :value="project.viewers" />
            </simple-field>
          </div>
        </collapsible-card>

        <collapsible-card title="1. Implementation Overview">

          <simple-field
            header="Software and related Digital Health Interventions (DHI)"
          >
            <platforms-list
              :platforms="project.platforms"
              :dhi="project.digitalHealthInterventions"
            />
          </simple-field>

          <simple-field
            header="Health focus area(s)"
          >
            <health-focus-areas-list
              :value="project.health_focus_areas"
            />
          </simple-field>

          <simple-field
            header="Health System Challenges (HSC)"
          >
            <health-system-challenges-list
              :value="project.hsc_challenges"
            />
          </simple-field>

          <simple-field
            header="Health Information System (HIS)"
          >
            <his-bucket-list
              :value="project.his_bucket"
            />
          </simple-field>

          <div class="GrayArea">
            <simple-field
              header="Coverage type"
            >
              <type-field
                :value="project.coverageType"
                :list="['Sub National', 'National']"
              />
            </simple-field>
          </div>

        </collapsible-card>
      </el-col>
      <el-col :span="6">
        <project-navigation />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ProjectNavigation from './ProjectNavigation';
import CollapsibleCard from './CollapsibleCard';
import SimpleField from './SimpleField';
import OrganisationItem from '../common/OrganisationItem';
import CountryItem from '../common/CountryItem';
import TeamList from './TeamList';
import PlatformsList from './PlatformsList';
import HealthFocusAreasList from './HealthFocusAreasList';
import HealthSystemChallengesList from './HealthSystemChallengesList';
import HisBucketList from './HisBucketList';
import TypeField from './TypeField';
import { mapGetters } from 'vuex';

export default {
  components: {
    ProjectNavigation,
    CollapsibleCard,
    SimpleField,
    OrganisationItem,
    CountryItem,
    TeamList,
    PlatformsList,
    HealthFocusAreasList,
    HealthSystemChallengesList,
    HisBucketList,
    TypeField
  },
  computed: {
    ...mapGetters({
      project: 'project/getProjectData'
    })
  },
  methods: {
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
