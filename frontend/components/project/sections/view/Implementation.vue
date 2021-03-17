<template>
  <div>
    <view-field v-for="field in fields" :key="field.prepend" v-bind="field" />
    <!--
    <simple-field
      :header="$gettext('Health System Challenges (HSC)') | translate"
      :prepend-label="12"
    >
      <health-system-challenges-list :value="project.hsc_challenges" />
    </simple-field> -->
    <!--


    <simple-field
      :header="$gettext('Health Information System (HIS)') | translate"
      :prepend-label="13"
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
      <simple-field v-if="isNationalLevelDeployment">
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
        $gettext('Has the government financially invested in the project?')
          | translate
      "
      :prepend-label="14"
    >
      <type-field :value="project.government_investor" :list="investedList" />
    </simple-field>

    <simple-field
      :header="$gettext('Implementing partner(s)') | translate"
      :prepend-label="15"
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
      :prepend-label="16"
    >
      <donors-list :value="project.donors" />
    </simple-field> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isEmpty, flatten } from "lodash";
import ViewField from "@/components/project/wrappers/ViewField";
import Loader from "@/components/project/wrappers/Loader";

// project components
import SimpleField from "@/components/project/SimpleField";
import TeamList from "@/components/project/TeamList";
import PlatformsList from "@/components/project/PlatformsList";
import TypeField from "@/components/project/TypeField";
import CoverageField from "@/components/project/CoverageField";
import SubLevelCoverageField from "@/components/project/SubLevelCoverageField";
import LicensesList from "@/components/project/LicensesList";
import StandardsList from "@/components/project/StandardsList";
import InteroperabilityLinksList from "@/components/project/InteroperabilityLinksList";
// common
import OrganisationItem from "@/components/common/OrganisationItem";
import CountryItem from "@/components/common/CountryItem";
import HealthFocusAreasList from "@/components/common/list/HealthFocusAreasList";
import HealthSystemChallengesList from "@/components/common/list/HealthSystemChallengesList";
import HisBucketList from "@/components/common/list/HisBucketList";
import DonorsList from "@/components/common/list/DonorsList";

export default {
  components: {
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
    ViewField,
    Loader,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      dhi: [],
      hfaList: [],
      hfa: [],
      hscList: [],
      hsc: [],
      fields: [],
    };
  },
  computed: {
    ...mapGetters({
      getCountryDetails: "countries/getCountryDetails",
      getDonorDetails: "system/getDonorDetails",
      technologyPlatforms: "projects/getTechnologyPlatforms",
      dhiDetails: "projects/getDigitalHealthInterventionDetails",
      getHfa: "projects/getHealthFocusAreas",
      getHsc: "projects/getHscChallenges",
    }),
    isGlobalSelected() {
      return this.country.id === process.env.GlobalCountryID;
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
    donors() {
      return this.project.donors
        .map((d) => this.getDonorDetails(d))
        .filter((d) => d.donor_questions && d.donor_questions.length > 0);
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
        this.$gettext("Yes, MOH is fully funding the project"),
      ];
    },
  },
  watch: {
    project: {
      inmediate: true,
      handler(project) {
        if (!isEmpty(project)) {
          const {
            platforms,
            digitalHealthInterventions,
            health_focus_areas,
            hsc_challenges,
          } = this.project;
          this.dhi = this.handleDhiList(platforms, digitalHealthInterventions);

          this.hfaList = this.handleNestedList("getHfa", "health_focus_areas");
          this.hfa = this.handleList(health_focus_areas, "hfaList");

          this.hscList = this.handleNestedList("getHsc", "challenges");
          this.hsc = this.handleList(hsc_challenges, "hscList", "challenge");
          this.fields = this.handleFields();
          this.loading = false;
        } else {
          this.loading = true;
        }
      },
    },
  },
  methods: {
    handleList(arr, getter, key = "name") {
      if (arr) {
        return this[getter]
          .filter((p) => arr.includes(p.id) && p[key])
          .map((i) => i[key]);
      }
      return [];
    },
    handleDhiList(platforms, interventions) {
      return platforms.map((platform) => ({
        name: this.technologyPlatforms.find((p) => p.id === platform).name,
        categories: interventions
          .filter((i) => i.platform === platform)
          .map((i) => this.dhiDetails(i.id)),
      }));
    },
    handleNestedList(list, key) {
      return flatten(this[list].map((item) => item[key]));
    },
    handleFields() {
      return [
        {
          prepend: 10,
          header: this.$gettext(
            "Software and related Digital Health Interventions (DHI)"
          ),
          content: this.dhi,
          complex: true,
          title: this.$gettext("Software"),
          subtitle: this.$gettext("Digital Health Intervention"),
        },
        {
          prepend: 11,
          header: this.$gettext("Health focus area (s)"),
          content: this.hfa,
        },
        {
          prepend: 12,
          header: this.$gettext("Health System Challenges (HSC)"),
          content: this.hsc,
        },
      ];
    },
  },
};
</script>

