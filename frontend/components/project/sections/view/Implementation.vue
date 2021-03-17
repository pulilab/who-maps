<template>
  <div>
    <view-field
      :prepend="10"
      :header="
        $gettext('Software and related Digital Health Interventions (DHI)')
          | translate
      "
      :content="'hola'"
    />
    <p>
      {{ project.platforms }}
    </p>
    <p>
      {{ project.digitalHealthInterventions }}
    </p>

    <simple-field
      :header="
        $gettext('Software and related Digital Health Interventions (DHI)')
          | translate
      "
      :prepend-label="10"
    >
      <platforms-list
        :platforms="project.platforms"
        :dhi="project.digitalHealthInterventions"
      />
    </simple-field>
    <!--
    <simple-field
      :header="$gettext('Health focus area(s)') | translate"
      :prepend-label="11"
    >
      <health-focus-areas-list :value="project.health_focus_areas" />
    </simple-field>

    <simple-field
      :header="$gettext('Health System Challenges (HSC)') | translate"
      :prepend-label="12"
    >
      <health-system-challenges-list :value="project.hsc_challenges" />
    </simple-field>

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
import isEmpty from "lodash/isEmpty";
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
  computed: {
    ...mapGetters({
      getCountryDetails: "countries/getCountryDetails",
      getDonorDetails: "system/getDonorDetails",
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
};
</script>

