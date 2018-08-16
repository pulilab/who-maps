<template>
  <div class="ProjectData">
    <el-row
      type="flex">
      <el-col :span="18">
        <collapsible-card
          id="general"
          title="1. General Overview">

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
                date
                header="Project start date"
              />
            </el-col>
            <el-col :span="12">
              <simple-field
                :content="project.end_date"
                date
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

        <collapsible-card
          id="implementation"
          title="2. Implementation Overview">

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
            <simple-field class="NationalLevelDeployment">
              <div slot="header">
                <fa icon="flag" />
                National Level Deployment
              </div>
              <coverage-field :coverage="project.national_level_deployment" />
            </simple-field>
            <sub-level-coverage-field
              :coverage="project.coverage"
              :coverage-data="project.coverageData"
              :coverage-second-level="project.coverageSecondLevel"
            />
          </div>

          <simple-field header="Has the government financially invested in the project?">
            <type-field
              :value="project.government_investor"
              :list="['No, they have not yet contributed', 'Yes, they are contributing in-kind people or time', 'Yes, there is a financial contribution through MOH budget']"
            />
          </simple-field>

          <simple-field header="Implementing partner(s)">
            <ul>
              <li
                v-for="(partner, index) in project.implementing_partners"
                :key="index">
                {{ partner }}
              </li>
            </ul>
          </simple-field>
        </collapsible-card>

        <collapsible-card
          id="technology"
          title="3. Techonology overview">
          <simple-field
            :content="project.implementation_dates"
            date
            header="Technology deployment date"
          />

          <simple-field
            header="Under what license is the project governed"
          >
            <licenses-list :value="project.licenses" />
          </simple-field>

          <simple-field
            :content="project.repository"
            link
            header="Code documentation or dowlonad link"
          />

          <simple-field
            :content="project.mobile_application"
            link
            header="Link to the application"
          />

          <simple-field
            :content="project.wiki"
            link
            header="Link to wiki or project webside"
          />

        </collapsible-card>

        <collapsible-card
          id="interoperability"
          title="4. Interoperability &amp; standards">
          <simple-field
            header="What other system do you interoperate with ?"
          >
            <interoperability-links-list :value="project.interoperability_links" />
          </simple-field>

          <simple-field
            header="What data standards does your digital health project use?"
          >
            <standards-list :value="project.interoperability_standards" />
          </simple-field>

        </collapsible-card>
      </el-col>
      <el-col :span="6">
        <project-navigation
          :readonly="readOnly"
          :published="!showDraft && !readOnly"
        />
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
import CoverageField from './CoverageField';
import SubLevelCoverageField from './SubLevelCoverageField';
import LicensesList from './LicensesList';
import StandardsList from './StandardsList';
import InteroperabilityLinksList from './InteroperabilityLinksList';

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
    TypeField,
    CoverageField,
    SubLevelCoverageField,
    LicensesList,
    StandardsList,
    InteroperabilityLinksList
  },
  props: {
    showDraft: {
      type: Boolean,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      draft: 'project/getProjectData',
      published: 'project/getPublished',
      user: 'user/getProfile'
    }),
    project () {
      return this.showDraft ? this.draft : this.published;
    },
    readOnly () {
      if (this.user) {
        const all = [...this.user.member, ...this.user.viewer];
        return !all.includes(+this.$route.params.id);
      }
      return true;
    }
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
