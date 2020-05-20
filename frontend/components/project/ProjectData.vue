<template>
  <div class="ProjectData">
    <el-row type="flex">
      <el-col :span="18">
        <collapsible-card
          id="general"
          :title="$gettext('General Overview') | translate"
          :prepend-title="1"
        >
          <simple-field
            :content="project.name"
            :header="$gettext('Project Name') | translate"
            :prepend-label="1"
          />

          <simple-field
            :header="$gettext('Organisation') | translate"
            :prepend-label="2"
          >
            <organisation-item :id="project.organisation" />
          </simple-field>

          <simple-field
            :header="$gettext('Project country') | translate"
            :prepend-label="3"
          >
            <country-item :id="project.country" :show-flag="false" />
          </simple-field>

          <simple-field
            :content="project.geographic_scope"
            :header="$gettext('Geographic scope') | translate"
            :prepend-label="4"
          />

          <simple-field
            :content="project.implementation_overview"
            :header="
              $gettext('Overview of the digital health implementation')
                | translate
            "
            :prepend-label="5"
          />

          <el-row>
            <el-col :span="12">
              <simple-field
                :content="project.contact_name"
                :header="$gettext('Contact name') | translate"
                :prepend-label="6"
              />
            </el-col>
            <el-col :span="12">
              <simple-field
                :content="project.contact_email"
                :header="$gettext('Contact email') | translate"
                :prepend-label="7"
              />
            </el-col>
          </el-row>
          <div class="GrayArea">
            <simple-field
              :header="$gettext('Team members') | translate"
              :prepend-label="8"
            >
              <team-list :value="project.team" />
            </simple-field>
            <simple-field
              :header="$gettext('Viewers') | translate"
              :prepend-label="9"
            >
              <team-list :value="project.viewers" />
            </simple-field>
          </div>
        </collapsible-card>

        <collapsible-card
          id="implementation"
          :title="$gettext('Implementation Overview') | translate"
          :prepend-title="2"
        >
          <simple-field
            :header="
              $gettext(
                'Software and related Digital Health Interventions (DHI)'
              ) | translate
            "
            :prepend-label="1"
          >
            <platforms-list
              :platforms="project.platforms"
              :dhi="project.digitalHealthInterventions"
            />
          </simple-field>

          <simple-field
            :header="$gettext('Health focus area(s)') | translate"
            :prepend-label="2"
          >
            <health-focus-areas-list :value="project.health_focus_areas" />
          </simple-field>

          <simple-field
            :header="$gettext('Health System Challenges (HSC)') | translate"
            :prepend-label="3"
          >
            <health-system-challenges-list :value="project.hsc_challenges" />
          </simple-field>

          <simple-field
            :header="$gettext('Health Information System (HIS)') | translate"
            :prepend-label="4"
          >
            <his-bucket-list :value="project.his_bucket" />
          </simple-field>

          <div class="GrayArea">
            <simple-field
              v-if="
                isNationalLevelDeployment ||
                  (project.coverage && project.coverage.length)
              "
              :header="$gettext('Coverage type')"
              :prepend-label="5"
            >
              <div v-show="isGlobalSelected" class="TypeField">
                <translate>International</translate>
              </div>
              <type-field
                v-show="!isGlobalSelected"
                :value="project.coverageType"
                :list="coverageList"
              />
            </simple-field>
            <simple-field v-if="isNationalLevelDeployment" :prepend-label="5">
              <div v-show="isGlobalSelected" slot="header">
                <fa icon="flag" />
                <translate>International Level Deployment</translate>
              </div>
              <div v-show="!isGlobalSelected" slot="header">
                <fa icon="flag" />
                <translate>National Level Deployment</translate>
              </div>

              <coverage-field :coverage="project.national_level_deployment" />
            </simple-field>

            <sub-level-coverage-field
              v-if="project.coverageType === 1"
              :coverage="project.coverage"
              :coverage-data="project.coverageData"
              :coverage-second-level="project.coverageSecondLevel"
            />
          </div>

          <simple-field
            :header="
              $gettext(
                'Has the government financially invested in the project?'
              ) | translate
            "
            :prepend-label="6"
          >
            <type-field
              :value="project.government_investor"
              :list="investedList"
            />
          </simple-field>

          <simple-field
            :header="$gettext('Implementing partner(s)') | translate"
            :prepend-label="7"
          >
            <ul>
              <li
                v-for="(partner, index) in project.implementing_partners"
                :key="index"
              >
                {{ partner }}
              </li>
            </ul>
          </simple-field>

          <simple-field
            :header="$gettext('Investor(s)') | translate"
            :prepend-label="8"
          >
            <donors-list :value="project.donors" />
          </simple-field>
        </collapsible-card>

        <!-- stage graph -->
        <stage-history />
        <!-- stage graph -->

        <collapsible-card
          id="technology"
          :title="$gettext('Techonology overview') | translate"
          :prepend-title="4"
        >
          <simple-field
            :content="project.implementation_dates"
            :header="$gettext('Technology deployment date') | translate"
            :prepend-label="1"
            date
          />

          <simple-field
            :header="
              $gettext('Under what license is the project governed') | translate
            "
            :prepend-label="2"
          >
            <licenses-list :value="project.licenses" />
          </simple-field>

          <simple-field
            :content="project.repository"
            :header="
              $gettext('Code documentation or download link') | translate
            "
            :prepend-label="3"
            link
          />

          <simple-field
            :content="project.mobile_application"
            :header="$gettext('Link to the application') | translate"
            :prepend-label="4"
            link
          />

          <simple-field
            :content="project.wiki"
            :header="$gettext('Link to wiki or project website') | translate"
            :prepend-label="5"
            link
          />
        </collapsible-card>

        <collapsible-card
          id="interoperability"
          :title="$gettext('Interoperability &amp; standards')"
          :prepend-title="5"
        >
          <simple-field
            :header="
              $gettext('What other system do you interoperate with ?')
                | translate
            "
            :prepend-label="1"
          >
            <interoperability-links-list
              :value="project.interoperability_links"
            />
          </simple-field>

          <simple-field
            :header="
              $gettext(
                'What data standards does your digital health project use?'
              ) | translate
            "
            :prepend-label="2"
          >
            <standards-list :value="project.interoperability_standards" />
          </simple-field>
        </collapsible-card>

        <collapsible-card
          v-if="countryQuestions && countryQuestions.length > 0"
          id="countrycustom"
          :title="customFieldsName(country.name)"
          :prepend-title="6"
        >
          <custom-readonly-field
            v-for="(question, idx) in countryQuestions"
            :id="question.id"
            :key="question.id"
            :question="question.question"
            :is-draft="isDraft"
            :type="question.type"
            :prepend-label="idx + 1"
          />
        </collapsible-card>

        <div v-if="donors && donors.length > 0" id="donorcustom">
          <collapsible-card
            v-for="(donor, idx) in donors"
            :key="donor.id"
            :title="customFieldsName(donor.name)"
            :prepend-title="7 + idx"
          >
            <custom-readonly-field
              v-for="(question, i) in donor.donor_questions"
              :id="question.id"
              :key="question.id"
              :question="question.question"
              :is-draft="isDraft"
              :type="question.type"
              :donor-id="donor.id"
              :prepend-label="i + 1"
            />
          </collapsible-card>
        </div>
      </el-col>
      <el-col :span="6">
        <project-navigation
          @handleClickUnPublish="
            handleClickUnPublish(
              {
                name: 'organisation-projects-id-edit',
                params: { ...$route.params }
              },
              $route.params.id
            )
          "
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ProjectNavigation from "./ProjectNavigation";
import CollapsibleCard from "./CollapsibleCard";
import SimpleField from "./SimpleField";
import OrganisationItem from "../common/OrganisationItem";
import CountryItem from "../common/CountryItem";
import TeamList from "./TeamList";
import PlatformsList from "./PlatformsList";
import HealthFocusAreasList from "../common/list/HealthFocusAreasList";
import HealthSystemChallengesList from "../common/list/HealthSystemChallengesList";
import HisBucketList from "../common/list/HisBucketList";
import TypeField from "./TypeField";
import CoverageField from "./CoverageField";
import SubLevelCoverageField from "./SubLevelCoverageField";
import LicensesList from "./LicensesList";
import StandardsList from "./StandardsList";
import InteroperabilityLinksList from "./InteroperabilityLinksList";
import DonorsList from "../common/list/DonorsList";
import CustomReadonlyField from "./CustomReadonlyField";
import handleProjectUnpublish from "@/components/mixins/handleProjectUnpublish";
import StageHistory from "@/components/project/sections/StageHistory";

import { mapGetters } from "vuex";

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
    InteroperabilityLinksList,
    DonorsList,
    CustomReadonlyField,
    StageHistory
  },
  mixins: [handleProjectUnpublish],
  computed: {
    ...mapGetters({
      draft: "project/getProjectData",
      published: "project/getPublished",
      getCountryDetails: "countries/getCountryDetails",
      getDonorDetails: "system/getDonorDetails"
    }),
    isGlobalSelected() {
      return this.country.id === process.env.GlobalCountryID;
    },
    route() {
      return this.$route.name.split("__")[0];
    },
    isDraft() {
      return this.route === "organisation-projects-id";
    },
    project() {
      return this.isDraft ? this.draft : this.published;
    },
    isNationalLevelDeployment() {
      return (
        this.project.coverageType === 2 &&
        this.project.national_level_deployment &&
        (this.project.national_level_deployment.clients ||
          this.project.national_level_deployment.facilities ||
          this.project.national_level_deployment.health_workers)
      );
    },
    country() {
      if (this.project.country) {
        return this.getCountryDetails(this.project.country);
      }
      return null;
    },
    countryQuestions() {
      if (this.country) {
        return this.country.country_questions;
      }
      return [];
    },
    donors() {
      return this.project.donors
        .map(d => this.getDonorDetails(d))
        .filter(d => d.donor_questions && d.donor_questions.length > 0);
    },
    coverageList() {
      return ["", this.$gettext("Sub National"), this.$gettext("National")];
    },
    investedList() {
      return [
        this.$gettext("No, they have not yet contributed"),
        this.$gettext("Yes, they are contributing in-kind people or time"),
        this.$gettext(
          "Yes, there is a financial contribution through MOH budget"
        ),
        this.$gettext("Yes, MOH is fully funding the project")
      ];
    }
  },
  methods: {
    customFieldsName(name) {
      return this.$gettext("{name} custom fields", { name });
    }
  }
};
</script>

<style lang="less">
@import "../../assets/style/variables.less";
@import "../../assets/style/mixins.less";

.ProjectData {
  .limitPageWidth();

  .Loader {
    display: block;
    margin: 0 auto 80px;
  }

  > .el-row {
    > .el-col {
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

  .ContentContainer {
    padding-bottom: 20px;
  }

  .CollapsibleCard {
    .SimpleField {
      margin-bottom: 40px;
      font-size: @fontSizeBase;
      line-height: 20px;

      .Header {
        margin-bottom: 10px;
        font-size: @fontSizeMedium;
        font-weight: 700;
      }

      .Content {
        ul {
          li {
            .svg-inline--fa {
              display: none;
            }
          }
        }
      }

      .SubLevelItem {
        box-sizing: border-box;
        width: 100%;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left: 3px;
        padding-left: 30px;
        border-left: 5px solid @colorGrayLight;

        .SimpleField {
          margin: 0 !important;

          .Header {
            font-size: @fontSizeBase !important;
          }
        }

        .CoverageField {
          .SimpleField {
            margin: 20px 0 0 !important;
          }
        }
      }

      .CountryItem {
        .CountryFlag {
          display: none;
        }

        .CountryName {
          margin: 0;
          font-size: @fontSizeBase;
          font-weight: 400;
        }
      }

      .PlatformList {
        .Header {
          font-size: @fontSizeBase;
        }

        .Content {
          .SimpleField {
            margin-top: 20px;
          }
        }
      }

      .StandardsList {
        li {
          a {
            display: block;
            margin: 5px 0 20px;
            color: @colorBrandPrimary;
            text-decoration: none;
            transition: @transitionAll;

            &:hover {
              color: @colorBrandPrimaryLight;
              text-decoration: underline;
            }
          }

          &:last-child {
            a {
              margin-bottom: 0;
            }
          }
        }
      }
    }

    .GrayArea {
      .svg-inline--fa {
        margin-right: 8px;
      }
    }
  }
}
</style>
