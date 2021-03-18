<template>
  <div>
    <view-field v-for="field in fields" :key="field.prepend" v-bind="field" />

    <!--
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
    -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isEmpty, flatten } from "lodash";

// project components
import ViewField from "@/components/project/wrappers/ViewField";
import Loader from "@/components/project/wrappers/Loader";
import SimpleField from "@/components/project/SimpleField";
import CoverageField from "@/components/project/CoverageField";
import SubLevelCoverageField from "@/components/project/SubLevelCoverageField";
import TypeField from "@/components/project/TypeField";

export default {
  components: {
    ViewField,
    Loader,
    SimpleField,
    CoverageField,
    SubLevelCoverageField,
    TypeField,
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
      his: [],
      donors: [],
      fields: [],
    };
  },
  computed: {
    ...mapGetters({
      getCountryDetails: "countries/getCountryDetails",
      getPlatforms: "projects/getTechnologyPlatforms",
      getDhi: "projects/getDigitalHealthInterventionDetails",
      getHfa: "projects/getHealthFocusAreas",
      getHsc: "projects/getHscChallenges",
      getHis: "projects/getHisBucket",
      getDonors: "system/getDonors",
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
            his_bucket,
            donors,
          } = this.project;

          this.dhi = this.handleDhiList(platforms, digitalHealthInterventions);
          this.hfaList = this.handleNestedList("getHfa", "health_focus_areas");
          this.hfa = this.handleList(health_focus_areas, "hfaList");
          this.hscList = this.handleNestedList("getHsc", "challenges");
          this.hsc = this.handleList(hsc_challenges, "hscList", "challenge");
          this.his = this.handleList(his_bucket, "getHis");
          this.donors = this.handleList(donors, "getDonors");

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
    handleNestedList(list, key) {
      return flatten(this[list].map((item) => item[key]));
    },
    handleDhiList(platforms, interventions) {
      return platforms.map((platform) => ({
        name: this.getPlatforms.find((p) => p.id === platform).name,
        categories: interventions
          .filter((i) => i.platform === platform)
          .map((i) => this.getDhi(i.id)),
      }));
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
        {
          prepend: 13,
          header: this.$gettext("Health Information System (HIS)"),
          content: this.his,
        },
        // aqui va el país
        {
          prepend: 14,
          header: this.$gettext(
            "Has the government financially invested in the project?"
          ),
          content: this.investedList[this.project.government_investor],
        },
        {
          prepend: 15,
          header: this.$gettext("Implementing partner (s)"),
          content: this.project.implementing_partners,
        },
        {
          prepend: 16,
          header: this.$gettext("Investor (s)"),
          content: this.donors,
        },
      ];
    },
  },
};
</script>

